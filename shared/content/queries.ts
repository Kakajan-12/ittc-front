import { safeContentGet, safeContentList } from "./client";
import { formatDayAndMonth, formatFullDate, formatTime } from "./format";
import { localized, localizedOrNull, type Locale } from "./localize";
import type {
  AgendaPhase,
  AgendaSession,
  AgendaSessionParticipant,
  FaqItem,
  News,
  Partner,
  Speaker,
  Brochure,
  BrochureKind,
  BrochureLocale,
  Contact,
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
  excerpt: string;
  tag: string;
  date: string;
  image: string | null;
};

export type NewsArticleModel = NewsCardModel & {
  content: string;
};

export type SpeakerModel = {
  id: number;
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
    excerpt: localized(item, "excerpt", locale),
    tag: item.tag ? `#${localized(item.tag, "title", locale)}` : "",
    date: formatFullDate(item.publishedAt, locale),
    image: item.coverImage?.url ?? null,
  };
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

  return {
    ...toNewsCard(item, locale),
    content: localized(item, "content", locale),
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
    name: localized(speaker, "fullName", locale),
    description:
      localized(speaker, "position", locale) ||
      localized(speaker, "company", locale),
    image: speaker.photo?.url ?? null,
  }));
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

export async function getPartners(locale: Locale): Promise<PartnerModel[]> {
  const items = await safeContentList<Partner>("partners", {
    limit: 100,
    orderBy: "order",
    orderDirection: "asc",
  });

  return items.map((partner) => ({
    id: partner.id,
    name: localized(partner, "name", locale),
    category: partner.category,
    logo: partner.logo?.url ?? null,
    website: partner.website,
  }));
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

export type SiteContactsModel = {
  phones: ContactModel[];
  emails: ContactModel[];
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
  const [contacts, settings] = await Promise.all([
    safeContentList<Contact>("contacts", {
      limit: 50,
      orderBy: "order",
      orderDirection: "asc",
    }),
    safeContentGet<SiteSettings>("settings"),
  ]);

  if (!contacts.length && !settings) return CONTACTS_FALLBACK;

  const models = contacts.map((contact) => toContactModel(contact, locale));
  const phones = models.filter((_, i) => contacts[i].type === "PHONE");
  const emails = models.filter((_, i) => contacts[i].type === "EMAIL");

  return {
    phones: phones.length ? phones : CONTACTS_FALLBACK.phones,
    emails: emails.length ? emails : CONTACTS_FALLBACK.emails,
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
  /** Direct link to the PDF. */
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

  return { id: item.id, url: item.file!.url, locale: item.locale };
}

/**
 * Заголовок блока с цифрами. Пусто — значит контент-API недоступен, и блок
 * подставит строку из переводов.
 */
export async function getResultsTitle(locale: Locale): Promise<string | null> {
  const settings = await safeContentGet<SiteSettings>("settings");

  return settings ? localized(settings, "resultsTitle", locale) : null;
}
