import { T_ENTITY } from "@/shared/api/types";

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

export namespace T_AGENDA {
  export namespace DAY {
    export type FIELDS = T_ENTITY & {
      eventId: number;
      startAt: Date;
      endAt: Date;
      titleRu: string | null;
      titleEn: string | null;
      titleTk: string | null;
    };

    export type CREATE_FIELDS = Omit<FIELDS, "id" | "createdAt" | "updatedAt">;
    export type UPDATE_FIELDS = Omit<FIELDS, "id" | "createdAt" | "updatedAt">;
  }

  export namespace ENTRY {
    export type TYPE = (typeof AGENDA_ENTRY_TYPES)[number];

    export type SPEAKER = {
      sortOrder: number;
      id: number;
      firstName: string;
      lastName: string;
      patronymicName: string | null;
      avatar: string | null;
      position: string | null;
      organizationId: number | null;
    };

    export type SPONSOR = {
      sortOrder: number;
      id: number;
      name: string;
      logo: string | null;
      iconLink: string | null;
      webLink: string | null;
      organizationType: "BUSINESS" | "GOVERNMENT";
    };

    type BASE_FIELDS = {
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
      type: T_AGENDA.ENTRY.TYPE;
      startAt: string;
      endAt: string;
      sortOrder: number;
    };

    export type FIELDS = T_ENTITY &
      BASE_FIELDS & {
        speakers: Array<SPEAKER>;
        sponsors: Array<SPONSOR>;
      };

    export type CREATE_FIELDS = BASE_FIELDS & {
      participantIds: Array<number>;
      sponsorIds: Array<number>; // organizations
    };
    export type UPDATE_FIELDS = CREATE_FIELDS;
  }

  export namespace ROOM {
    export type FIELDS = T_ENTITY & {
      titleEn: string;
      titleRu: string;
      titleTk: string;
      locationId: number;
      capacity: string;
    };

    export type CREATE_FIELDS = Omit<FIELDS, "id" | "createdAt" | "updatedAt">;
    export type UPDATE_FIELDS = Omit<FIELDS, "id" | "createdAt" | "updatedAt">;
  }
}
