import { T_ENTITY } from "@/shared/api/types";

export type PackageFeature = T_ENTITY & {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  status: string;
};
