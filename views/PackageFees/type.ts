import { T_ENTITY } from "@/shared/api/types";

export type T_EVENT_PACKAGE_FEE = T_ENTITY & {
  titleEn: string;
  titleRu: string;
  titleTk: string;
  price: number;
  currency: string;
  isLocal: boolean;
  status: "ACTIVE" | "DISABLED";
};



