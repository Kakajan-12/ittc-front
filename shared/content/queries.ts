import { contentList, safeContentGet, safeContentList } from "./client";
import { CONTENT_API_URL } from "./config";
import { formatDayAndMonth, formatFullDate, formatTime } from "./format";
import { localized, localizedOrNull, type Locale } from "./localize";
import type {
  AgendaPhase,
  AgendaSession,
  AgendaSessionParticipant,
  FaqItem,
  News,
  Partner,
  PartnerKind,
  SessionRole,
  Speaker,
  SpeakerDetail,
  Brochure,
  BrochureKind,
  BrochureLocale,
  Contact,
  SocialLink,
  SocialNetwork,
  HeroBanner,
  SiteSettings,
  Sponsor,
  StatCounter,
  StaticPage,
} from "./types";

/**
 * Server-side reads of the content API.
 *
 * Every function returns a view model with the text already resolved for the
 * requested locale, so components stay free of En/Ru/Tk plumbing.
 */

// -- view models -------------------------------------------------------------

export type NewsCardModel = {
  id: number;
  slug: string;
  title: string;
  tag: string;
  date: string;
  image: string | null;
};

export type NewsArticleModel = NewsCardModel & {
  content: string;
  /** Для поисковиков и превью ссылки: начало текста, без разметки. */
  description: string;
};

/**
 * Первые ~160 символов текста без HTML, обрезанные по слову. Краткого
 * описания у новости больше нет, поэтому описание страницы берётся из текста.
 */
function describe(html: string, max = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:!?–—-]+$/, "")}…`;
}

export type SpeakerModel = {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string | null;
};

export type SponsorModel = {
  id: number;
  name: string;
  tier: Sponsor["tier"];
  logo: string | null;
  website: string | null;
};

export type PartnerModel = {
  id: number;
  name: string;
  category: Partner["category"];
  logo: string | null;
  website: string | null;
};

export type FaqModel = {
  id: number;
  question: string;
  answer: string;
};

export type StatModel = {
  key: string;
  value: number;
  suffix: string | null;
  label: string;
};

export type PageModel = {
  slug: string;
  title: string;
  content: string;
  cover: string | null;
};

export type SessionPersonModel = {
  id: number;
  name: string;
  description: string;
  image: string | null;
};

export type SessionModel = {
  id: number;
  icon: string;
  title: string;
  startTime: string;
  endTime: string | null;
  room: string | null;
  sponsors: string[];
  details: {
    description: string;
    keynote: SessionPersonModel[];
    moderators: SessionPersonModel[];
    speakers: SessionPersonModel[];
  } | null;
};

export type AgendaDayModel = {
  id: string;
  number: number;
  date: string;
  sessions: SessionModel[];
};

export type AgendaPhaseModel = {
  id: string;
  title: string;
  days: AgendaDayModel[];
};

// -- news --------------------------------------------------------------------

function toNewsCard(item: News, locale: Locale): NewsCardModel {
  return {
    id: item.id,
    slug: item.slug,
    title: localized(item, "title", locale),
    tag: item.tag ? `#${localized(item.tag, "title", locale)}` : "",
    date: formatFullDate(item.publishedAt, locale),
    image: item.coverImage?.url ?? null,
  };
}

/** Новостей на одной странице списка /news. */
export const NEWS_PAGE_SIZE = 12;

const NEWS_LOCALE_SUFFIX: Record<Locale, "En" | "Ru" | "Tk"> = {
  en: "En",
  ru: "Ru",
  tk: "Tk",
};

export type NewsPageModel = {
  items: NewsCardModel[];
  /** Сколько всего новостей подходит — из API, для числа страниц. */
  total: number;
  pageCount: number;
};

/**
 * Одна страница списка новостей. Делит на страницы и ищет API: сайт
 * получает ровно NEWS_PAGE_SIZE новостей нужной страницы и общее число.
 * Поиск — по заголовку на языке страницы.
 */
export async function getNewsPage(
  locale: Locale,
  page: number,
  query: string,
): Promise<NewsPageModel> {
  const suffix = NEWS_LOCALE_SUFFIX[locale];
  const search = query.trim();

  try {
    const { items, total } = await contentList<News>("news", {
      offset: (page - 1) * NEWS_PAGE_SIZE,
      limit: NEWS_PAGE_SIZE,
      orderBy: "publishedAt",
      orderDirection: "desc",
      ...(search
        ? { search, searchFields: [`title${suffix}`] }
        : {}),
    });

    return {
      items: items.map((item) => toNewsCard(item, locale)),
      total,
      pageCount: Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE)),
    };
  } catch (error) {
    // Как и остальные разделы: сбой API не роняет страницу.
    console.error("[content] news page failed:", (error as Error).message);
    return { items: [], total: 0, pageCount: 1 };
  }
}

export async function getNews(
  locale: Locale,
  limit = 50,
): Promise<NewsCardModel[]> {
  const items = await safeContentList<News>("news", {
    limit,
    orderBy: "publishedAt",
    orderDirection: "desc",
  });

  return items.map((item) => toNewsCard(item, locale));
}

export async function getNewsArticle(
  slug: string,
  locale: Locale,
): Promise<NewsArticleModel | null> {
  const item = await safeContentGet<News>(`news/slug/${slug}`, {
    // The detail view counts reads, so it is refreshed more eagerly.
    revalidate: 60,
  });

  if (!item) return null;

  const content = localized(item, "content", locale);

  return {
    ...toNewsCard(item, locale),
    content,
    description: describe(content),
  };
}

// -- speakers ----------------------------------------------------------------

export async function getSpeakers(locale: Locale): Promise<SpeakerModel[]> {
  const items = await safeContentList<Speaker>("speakers", {
    limit: 100,
    orderBy: "order",
    orderDirection: "asc",
  });

  return items.map((speaker) => ({
    id: speaker.id,
    slug: speaker.slug,
    name: localized(speaker, "fullName", locale),
    description:
      localized(speaker, "position", locale) ||
      localized(speaker, "company", locale),
    image: speaker.photo?.url ?? null,
  }));
}

export type SpeakerSessionModel = {
  id: number;
  title: string;
  role: SessionRole;
  /** "24 ноября 2026 г." */
  date: string;
  /** "09:00 – 10:30" */
  time: string;
  room: string | null;
};

export type SpeakerDetailModel = SpeakerModel & {
  position: string | null;
  company: string | null;
  country: string | null;
  /** HTML из редактора админки. */
  bio: string | null;
  isKeynote: boolean;
  sessions: SpeakerSessionModel[];
};

/** Страница спикера. `null` — такого спикера нет или он не опубликован. */
export async function getSpeaker(
  slug: string,
  locale: Locale,
): Promise<SpeakerDetailModel | null> {
  const item = await safeContentGet<SpeakerDetail>(
    `speakers/slug/${encodeURIComponent(slug)}`,
  );

  if (!item) return null;

  const position = localizedOrNull(item, "position", locale);
  const company = localizedOrNull(item, "company", locale);

  return {
    id: item.id,
    slug: item.slug,
    name: localized(item, "fullName", locale),
    description: position || company || "",
    image: item.photo?.url ?? null,
    position,
    company,
    country: item.country ? localized(item.country, "title", locale) : null,
    bio: localizedOrNull(item, "bio", locale),
    isKeynote: item.isKeynote,
    sessions: (item.sessions ?? []).map((session) => ({
      id: session.id,
      title: localized(session, "title", locale),
      role: session.role,
      date: formatFullDate(session.day.date, locale),
      time: [session.startTime, session.endTime]
        .filter(Boolean)
        .map((value) => formatTime(value, locale))
        .join(" – "),
      room: localizedOrNull(session, "room", locale),
    })),
  };
}

// -- sponsors & partners -----------------------------------------------------

export async function getSponsors(locale: Locale): Promise<SponsorModel[]> {
  const items = await safeContentList<Sponsor>("sponsors", {
    limit: 100,
    orderBy: "order",
    orderDirection: "asc",
  });

  return items.map((sponsor) => ({
    id: sponsor.id,
    name: localized(sponsor, "name", locale),
    tier: sponsor.tier,
    logo: sponsor.logo?.url ?? null,
    website: sponsor.website,
  }));
}

/**
 * Партнёры для бегущей строки на главной; организаторы — та же сущность с
 * другим видом, их читает `getOrganizers`.
 */
export async function getPartners(
  locale: Locale,
  kind: PartnerKind = "PARTNER",
): Promise<PartnerModel[]> {
  const items = await safeContentList<Partner>("partners", {
    limit: 100,
    orderBy: "order",
    orderDirection: "asc",
  });

  return items
    .filter((partner) => partner.kind === kind)
    .map((partner) => ({
      id: partner.id,
      name: localized(partner, "name", locale),
      category: partner.category,
      logo: partner.logo?.url ?? null,
      website: partner.website,
    }));
}

/** Логотипы в блоке «Организаторы и официальные партнёры». */
export function getOrganizers(locale: Locale): Promise<PartnerModel[]> {
  return getPartners(locale, "ORGANIZER");
}

// -- faq & stats -------------------------------------------------------------

export async function getFaq(locale: Locale): Promise<FaqModel[]> {
  const items = await safeContentList<FaqItem>("faq", {
    limit: 100,
    orderBy: "order",
    orderDirection: "asc",
  });

  return items.map((item) => ({
    id: item.id,
    question: localized(item, "question", locale),
    answer: localized(item, "answer", locale),
  }));
}

export async function getStats(locale: Locale): Promise<StatModel[]> {
  const items = await safeContentList<StatCounter>("stats", {
    limit: 50,
    orderBy: "order",
    orderDirection: "asc",
  });

  return items.map((stat) => ({
    key: stat.key,
    value: stat.value,
    suffix: stat.suffix,
    label: localized(stat, "label", locale),
  }));
}

// -- editorial pages ---------------------------------------------------------

export async function getPage(
  slug: string,
  locale: Locale,
): Promise<PageModel | null> {
  const page = await safeContentGet<StaticPage>(`pages/slug/${slug}`);

  if (!page) return null;

  return {
    slug: page.slug,
    title: localized(page, "title", locale),
    content: localized(page, "content", locale),
    cover: page.coverImage?.url ?? null,
  };
}

// -- agenda ------------------------------------------------------------------

function toPerson(
  participant: AgendaSessionParticipant,
  locale: Locale,
): SessionPersonModel {
  const speaker = participant.speaker;

  return {
    id: participant.id,
    // A slot may point at a speaker record or carry a hand-typed name.
    name:
      localized(participant, "name", locale) ||
      localized(speaker, "fullName", locale),
    description:
      localized(participant, "description", locale) ||
      localized(speaker, "position", locale),
    image: participant.photo?.url ?? speaker?.photo?.url ?? null,
  };
}

function toSession(session: AgendaSession, locale: Locale): SessionModel {
  const description = localizedOrNull(session, "description", locale);
  const people = session.participants ?? [];

  const byRole = (role: AgendaSessionParticipant["role"]) =>
    people
      .filter((participant) => participant.role === role)
      .map((participant) => toPerson(participant, locale));

  const keynote = byRole("KEYNOTE");
  const moderators = byRole("MODERATOR");
  const speakers = byRole("SPEAKER");
  const hasDetails =
    !!description || keynote.length + moderators.length + speakers.length > 0;

  return {
    id: session.id,
    icon: session.icon,
    title: localized(session, "title", locale),
    startTime: formatTime(session.startTime, locale),
    endTime: session.endTime ? formatTime(session.endTime, locale) : null,
    room: localizedOrNull(session, "room", locale),
    sponsors: (session.sponsors ?? [])
      .map((link) => link.sponsor?.logo?.url)
      .filter((url): url is string => !!url),
    details: hasDetails
      ? { description: description ?? "", keynote, moderators, speakers }
      : null,
  };
}

export async function getAgenda(locale: Locale): Promise<AgendaPhaseModel[]> {
  const phases = await safeContentGet<AgendaPhase[]>("agenda");

  if (!phases) return [];

  return phases.map((phase) => ({
    id: phase.key,
    title: localized(phase, "title", locale),
    days: (phase.days ?? []).map((day) => ({
      id: `${phase.key}-${day.number}`,
      number: day.number,
      date: formatDayAndMonth(day.date, locale),
      sessions: (day.sessions ?? []).map((session) =>
        toSession(session, locale),
      ),
    })),
  }));
}

// -- site settings and contacts ----------------------------------------------

export type ContactModel = {
  id: number;
  value: string;
  /** Ready for href: `tel:` for phones, `mailto:` for e-mails. */
  href: string;
  /** Optional caption, shown when there is more than one of a kind. */
  label: string | null;
};

export type SocialLinkModel = { id: number; network: SocialNetwork; url: string };

export type SiteContactsModel = {
  phones: ContactModel[];
  emails: ContactModel[];
  /** Соцсети в подвале, из админки; иконку подвал выбирает по `network`. */
  socials: SocialLinkModel[];
  partnerUrl: string;
};

/**
 * Header and footer render on every page, so a content API hiccup must not
 * blank out the contacts — these are the values the site shipped with.
 */
const CONTACTS_FALLBACK: SiteContactsModel = {
  phones: [
    { id: 0, value: "+99361 480 080", href: "tel:+99361480080", label: null },
  ],
  emails: [
    {
      id: 0,
      value: "info@oguzforum.com",
      href: "mailto:info@oguzforum.com",
      label: null,
    },
  ],
  socials: [
    { id: 0, network: "TELEGRAM", url: "https://t.me/Oguz_forum_expo" },
    { id: 0, network: "WHATSAPP", url: "https://wa.me/99361480080" },
    {
      id: 0,
      network: "INSTAGRAM",
      url: "https://www.instagram.com/oguzforumexpo?igsh=eWhxMDR1c3JmanVz",
    },
    {
      id: 0,
      network: "LINKEDIN",
      url: "https://tm.linkedin.com/company/hi-tech-turkmenistan",
    },
  ],
  partnerUrl: "https://oguzforum.com",
};

/** `tel:` ignores spaces and dashes; browsers dial what is left. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function toContactModel(contact: Contact, locale: Locale): ContactModel {
  return {
    id: contact.id,
    value: contact.value,
    href:
      contact.type === "PHONE"
        ? telHref(contact.value)
        : `mailto:${contact.value}`,
    label: localizedOrNull(contact, "label", locale),
  };
}

export async function getSiteContacts(
  locale: Locale,
): Promise<SiteContactsModel> {
  const [contacts, settings, socials] = await Promise.all([
    safeContentList<Contact>("contacts", {
      limit: 50,
      orderBy: "order",
      orderDirection: "asc",
    }),
    safeContentGet<SiteSettings>("settings"),
    safeContentList<SocialLink>("social-links", {
      limit: 20,
      orderBy: "order",
      orderDirection: "asc",
    }),
  ]);

  if (!contacts.length && !settings) return CONTACTS_FALLBACK;

  const models = contacts.map((contact) => toContactModel(contact, locale));
  const phones = models.filter((_, i) => contacts[i].type === "PHONE");
  const emails = models.filter((_, i) => contacts[i].type === "EMAIL");

  return {
    phones: phones.length ? phones : CONTACTS_FALLBACK.phones,
    emails: emails.length ? emails : CONTACTS_FALLBACK.emails,
    // Пустой список — решение редактора (всё снято с публикации), а не сбой:
    // сбой API уже отсёк ранний возврат с запасными значениями выше.
    socials: socials.map(({ id, network, url }) => ({ id, network, url })),
    partnerUrl: settings?.partnerUrl ?? CONTACTS_FALLBACK.partnerUrl,
  };
}

export type HeroModel = {
  image: string | null;
  title: string;
  date: string;
  location: string;
  /** ISO string; null hides the countdown. */
  eventStartsAt: string | null;
};

/**
 * The hero is the first thing on the page, so a content API hiccup must not
 * leave it headless — these are the values the site shipped with. `image: null`
 * makes the component fall back to the bundled photo.
 */
const HERO_FALLBACK: Record<Locale, HeroModel> = {
  en: {
    image: null,
    title: "International Transport & Transit Corridors Conference 2026",
    date: "24 - 26 November 2026",
    location: "Ashgabat, Turkmenistan",
    eventStartsAt: null,
  },
  ru: {
    image: null,
    title:
      "Международная конференция по транспортным и транзитным коридорам 2026",
    date: "24 - 26 ноября 2026",
    location: "Ашхабад, Туркменистан",
    eventStartsAt: null,
  },
  tk: {
    image: null,
    title: "Halkara ulag we üstaşyr geçelgeleri maslahaty 2026",
    date: "2026-njy ýylyň 24-26-njy noýabry",
    location: "Aşgabat, Türkmenistan",
    eventStartsAt: null,
  },
};

export async function getHeroBanner(locale: Locale): Promise<HeroModel> {
  const hero = await safeContentGet<HeroBanner>("hero");

  if (!hero) return HERO_FALLBACK[locale];

  return {
    image: hero.image?.url ?? null,
    title: localized(hero, "title", locale),
    date: localized(hero, "date", locale),
    location: localized(hero, "location", locale),
    eventStartsAt: hero.eventStartsAt,
  };
}

// -- brochure ----------------------------------------------------------------

/** На сайте брошюра только скачивается, поэтому здесь лишь ссылка и язык. */
export type BrochureModel = {
  id: number;
  /**
   * Ссылка для кнопки «Скачать». Ведёт не прямо на PDF, а на API: там
   * скачивание засчитывается, и API перенаправляет на сам файл.
   */
  url: string;
  /** Язык самого файла — он может отличаться от языка страницы. */
  locale: BrochureLocale;
};

const BROCHURE_LOCALE: Record<Locale, BrochureLocale> = {
  en: "EN",
  ru: "RU",
  tk: "TK",
};

/**
 * Брошюра на языке страницы. Если на нужном языке файла ещё нет, отдаётся
 * русский, а если нет и его — первая опубликованная: кнопка «Брошюра» должна
 * вести к документу всегда, а не исчезать.
 */
export async function getBrochure(
  locale: Locale,
  kind: BrochureKind = "BROCHURE",
): Promise<BrochureModel | null> {
  const items = await safeContentList<Brochure>("brochures", {
    limit: 20,
    orderBy: "order",
    orderDirection: "asc",
  });

  const withFile = items.filter(
    (item) => item.file?.url && item.kind === kind,
  );

  if (!withFile.length) return null;

  const wanted = BROCHURE_LOCALE[locale];
  const item =
    withFile.find((brochure) => brochure.locale === wanted) ??
    withFile.find((brochure) => brochure.locale === "RU") ??
    withFile[0];

  return {
    id: item.id,
    url: `${CONTENT_API_URL}/brochures/${item.id}/download`,
    locale: item.locale,
  };
}

export type SupportLetterModel = {
  /** Прямая ссылка на файл: картинку показываем на странице, PDF встраиваем. */
  url: string;
  isPdf: boolean;
};

/**
 * Письмо официальной поддержки на языке страницы. Если его нет — английское:
 * приглашение пишут прежде всего на английском, а не на русском, как брошюры.
 */
export async function getSupportLetter(
  locale: Locale,
): Promise<SupportLetterModel | null> {
  const items = await safeContentList<Brochure>("brochures", {
    limit: 20,
    orderBy: "order",
    orderDirection: "asc",
  });

  const letters = items.filter(
    (item) => item.kind === "SUPPORT_LETTER" && item.file?.url,
  );

  if (!letters.length) return null;

  const wanted = BROCHURE_LOCALE[locale];
  const item =
    letters.find((letter) => letter.locale === wanted) ??
    letters.find((letter) => letter.locale === "EN") ??
    letters[0];

  return {
    url: item.file!.url,
    isPdf: item.file!.mimeType === "application/pdf",
  };
}

/** Заголовки секций, в которых стоит год: их правят раз в год из админки. */
export type SectionTitles = {
  /** Блок с цифрами на главной и на «О мероприятии». */
  results: string | null;
  /** Блок логотипов спонсоров на главной. */
  sponsors: string | null;
};

/**
 * Оба заголовка приходят одним запросом — они лежат в одной записи настроек.
 * null означает, что контент-API недоступен: блок подставит строку из
 * переводов и не останется без шапки.
 */
export async function getSectionTitles(locale: Locale): Promise<SectionTitles> {
  const settings = await safeContentGet<SiteSettings>("settings");

  if (!settings) return { results: null, sponsors: null };

  return {
    results: localized(settings, "resultsTitle", locale),
    sponsors: localized(settings, "sponsorsTitle", locale),
  };
}
