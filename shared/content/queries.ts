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
