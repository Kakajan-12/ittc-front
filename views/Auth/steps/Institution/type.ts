import { T_ENTITY } from "@/shared/api_v2/types";

export type T_INSTITUTE = T_ENTITY & {
  titleTk: string;
  titleRu: string;
  titleEn: string;
  logo: string;
  userCount: number;
};
