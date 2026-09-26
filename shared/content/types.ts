/** Entities as returned by ittc-back. Trilingual fields come as En/Ru/Tk triples. */

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Entity = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type MediaFile = Entity & {
  kind: "IMAGE" | "DOCUMENT" | "OTHER";
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altEn: string | null;
  altRu: string | null;
  altTk: string | null;
};

export type NewsTag = Entity & {
  slug: string;
  titleEn: string;
  titleRu: string;
  titleTk: string;
};

export type News = Entity & {
  slug: string;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  excerptEn: string | null;
  excerptRu: string | null;
  excerptTk: string | null;
  contentEn: string;
  contentRu: string;
  contentTk: string;
  coverImage: MediaFile | null;
  tag: NewsTag | null;
  status: ContentStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  viewCount: number;
};

export type Country = Entity & {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  code: string;
};

export type Speaker = Entity & {
  slug: string;
  fullNameEn: string;
  fullNameRu: string;
  fullNameTk: string;
  positionEn: string | null;
  positionRu: string | null;
  positionTk: string | null;
  companyEn: string | null;
  companyRu: string | null;
  companyTk: string | null;
  bioEn: string | null;
  bioRu: string | null;
  bioTk: string | null;
  photo: MediaFile | null;
  country?: Country | null;
  isKeynote: boolean;
  order: number;
};

export type Sponsor = Entity & {
  nameEn: string;
  nameRu: string;
  nameTk: string;
  tier:
    | "GENERAL"
    | "DIAMOND"
    | "PLATINUM"
    | "GOLD"
    | "SILVER"
    | "BRONZE"
    | "SUPPORTING";
  logo: MediaFile | null;
  website: string | null;
  order: number;
};

/** Партнёры и организаторы — одна сущность, различаются видом. */
export type PartnerKind = "PARTNER" | "ORGANIZER";

export type Partner = Entity & {
  nameEn: string;
  nameRu: string;
  nameTk: string;
  kind: PartnerKind;
  category: "MEDIA" | "KNOWLEDGE" | "STRATEGIC" | "TECHNOLOGY" | "OTHER";
  logo: MediaFile | null;
  website: string | null;
  order: number;
};

export type FaqItem = Entity & {
  questionEn: string;
  questionRu: string;
  questionTk: string;
  answerEn: string;
  answerRu: string;
  answerTk: string;
  category: string | null;
  order: number;
};

export type StatCounter = Entity & {
  key: string;
  value: number;
  suffix: string | null;
  labelEn: string;
  labelRu: string;
  labelTk: string;
  order: number;
};

export type StaticPage = Entity & {
  slug: string;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  contentEn: string;
  contentRu: string;
  contentTk: string;
  coverImage: MediaFile | null;
  publishedAt: string | null;
};

export type SessionRole = "KEYNOTE" | "MODERATOR" | "SPEAKER";

export type AgendaSessionParticipant = Entity & {
  role: SessionRole;
  nameEn: string | null;
  nameRu: string | null;
  nameTk: string | null;
  descriptionEn: string | null;
  descriptionRu: string | null;
  descriptionTk: string | null;
  photo: MediaFile | null;
  speaker: Speaker | null;
  order: number;
};

export type AgendaSessionSponsor = Entity & {
  sponsor: Sponsor;
  order: number;
};

export type AgendaSession = Entity & {
  icon: string;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  descriptionEn: string | null;
  descriptionRu: string | null;
  descriptionTk: string | null;
  startTime: string;
  endTime: string | null;
  roomEn: string | null;
  roomRu: string | null;
  roomTk: string | null;
  participants: AgendaSessionParticipant[];
  sponsors: AgendaSessionSponsor[];
  order: number;
};

export type AgendaDay = Entity & {
  number: number;
  date: string;
  titleEn: string | null;
  titleRu: string | null;
  titleTk: string | null;
  sessions: AgendaSession[];
  order: number;
};

export type AgendaPhase = Entity & {
  key: string;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  days: AgendaDay[];
  order: number;
};

/** Site-wide values that cannot repeat; one record, not localised. */
export type SiteSettings = {
  id: number;
  partnerUrl: string;
  resultsTitleEn: string;
  resultsTitleRu: string;
  resultsTitleTk: string;
  sponsorsTitleEn: string;
  sponsorsTitleRu: string;
  sponsorsTitleTk: string;
  visaUrl: string | null;
  flightUrl: string | null;
  hotelUrl: string | null;
};

/** The hero block on the home page; one record. */
export type HeroBanner = {
  id: number;
  image: MediaFile | null;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  dateEn: string;
  dateRu: string;
  dateTk: string;
  locationEn: string;
  locationRu: string;
  locationTk: string;
  eventStartsAt: string | null;
};

export type BrochureLocale = "EN" | "RU" | "TK";

/** Брошюра и путеводитель — одна сущность, различаются видом. */
export type BrochureKind = "BROCHURE" | "TRAVEL_GUIDE" | "SUPPORT_LETTER";

/** Одна брошюра на язык; файл всегда PDF. */
export type Brochure = Entity & {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  descriptionEn: string | null;
  descriptionRu: string | null;
  descriptionTk: string | null;
  kind: BrochureKind;
  locale: BrochureLocale;
  file: MediaFile | null;
  coverImage: MediaFile | null;
  order: number;
};

export type ContactType = "PHONE" | "EMAIL";

export type SocialNetwork =
  | "TELEGRAM"
  | "WHATSAPP"
  | "INSTAGRAM"
  | "LINKEDIN"
  | "FACEBOOK"
  | "YOUTUBE"
  | "X"
  | "TIKTOK";

export type SocialLink = Entity & {
  network: SocialNetwork;
  url: string;
  order: number;
};

/** Phones and e-mails; the footer lists them, the header takes the first. */
export type Contact = Entity & {
  type: ContactType;
  value: string;
  labelEn: string | null;
  labelRu: string | null;
  labelTk: string | null;
  order: number;
};

/** `GET /speakers/slug/:slug` — спикер и сессии программы, где он выступает. */
export type SpeakerDetail = Speaker & {
  sessions: Array<
    Omit<AgendaSession, "participants" | "sponsors"> & {
      role: SessionRole;
      day: Omit<AgendaDay, "sessions"> & { phase: { key: string } };
    }
  >;
};
