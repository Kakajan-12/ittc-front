import { T_ENTITY } from "@/shared/api/types";

export type T_EVENT = T_ENTITY & {
  titleRu: string;
  titleTk: string;
  titleEn: string;
  bannerImage: string | null;
  bannerLogo: string | null;
  eventStartsAt: Date;
  eventEndsAt: Date;
  registrationStartsAt: Date;
  registrationEndsAt: Date;
  status: "ACTIVE" | "DISABLED";
};
