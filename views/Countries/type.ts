import { T_ENTITY } from "@/shared/api/types";

export type Country = T_ENTITY & {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  code: string;
};
