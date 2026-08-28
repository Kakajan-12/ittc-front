import { T_ENTITY } from "@/shared/api/types";

export type EventPackageType = T_ENTITY & {
  titleRu: string;
  titleEn: string;
  titleTk: string;
  status: string;
};
