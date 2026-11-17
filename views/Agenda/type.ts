import { T_ENTITY } from "@/shared/api/types";

// Admins enter agenda dates in Turkmenistan time; the API stores them in UTC
export const AGENDA_TIME_ZONE = "Asia/Ashgabat";

export const AGENDA_ENTRY_TYPES = [
  "REGISTRATION",
  "TRANSFER",
  "EXHIBITION",
  "CEREMONY",
  "SESSION",
  "BREAK",
  "LUNCH",
  "NETWORKING",
  "VIP_TOUR",
  "WORKSHOP",
  "OTHER",

  "CITY_TOUR",
  "OPENING",
  "COFFEE_BREAK",
  "MEETING",
  "DINNER",
  "CLOSING",
  "CONTRACT_SIGNING_CEREMONY",
  "BOAT_EXCURSION",
] as const;

// ---------- Day ----------

export type T_AGENDA_DAY = T_ENTITY & {
  eventId: number;
  startAt: Date;
  endAt: Date;
  titleRu: string | null;
  titleEn: string | null;
  titleTk: string | null;
};

export type T_AGENDA_DAY_CREATE = Omit<
  T_AGENDA_DAY,
  "id" | "createdAt" | "updatedAt"
>;
export type T_AGENDA_DAY_UPDATE = T_AGENDA_DAY_CREATE;

// ---------- Entry ----------

export type T_AGENDA_ENTRY_TYPE = (typeof AGENDA_ENTRY_TYPES)[number];

export type T_AGENDA_SPEAKER = {
  sortOrder: number;
  id: number;
  firstName: string;
  lastName: string;
  patronymicName: string | null;
  avatar: string | null;
  position: string | null;
  organizationId: number | null;
};

export type T_AGENDA_SPONSOR = {
  sortOrder: number;
  id: number;
  name: string;
  logo: string | null;
  iconLink: string | null;
  webLink: string | null;
  organizationType: "BUSINESS" | "GOVERNMENT";
};

type T_AGENDA_ENTRY_BASE = {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  descriptionEn?: string | null;
  descriptionRu?: string | null;
  descriptionTk?: string | null;
  agendaDayId: number;
  // Sessions may have no room
  agendaRoomId: number | null;
  moderatorId: number | null;
  type: T_AGENDA_ENTRY_TYPE;
  startAt: string;
  endAt: string;
  sortOrder: number;
};

export type T_AGENDA_ENTRY = T_ENTITY &
  T_AGENDA_ENTRY_BASE & {
    speakers: Array<T_AGENDA_SPEAKER>;
    sponsors: Array<T_AGENDA_SPONSOR>;
  };

export type T_AGENDA_ENTRY_CREATE = T_AGENDA_ENTRY_BASE & {
  participantIds: Array<number>;
  sponsorIds: Array<number>; // organizations
};
export type T_AGENDA_ENTRY_UPDATE = T_AGENDA_ENTRY_CREATE;

// ---------- Room ----------

export type T_AGENDA_ROOM = T_ENTITY & {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  locationId: number;
  capacity: string;
};

export type T_AGENDA_ROOM_CREATE = Omit<
  T_AGENDA_ROOM,
  "id" | "createdAt" | "updatedAt"
>;
export type T_AGENDA_ROOM_UPDATE = T_AGENDA_ROOM_CREATE;
