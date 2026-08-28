import { T_ENTITY } from "@/shared/api/types";

export type T_PaymentMethod = T_ENTITY & {
  status: "ACTIVE" | "DISABLED";

  titleEn: string;
  titleRu: string;
  titleTk: string;

  subtitleEn: string | null;
  subtitleRu: string | null;
  subtitleTk: string | null;

  type: "BANK_TRANSFER" | "ON_ARRIVAL" | "ONLINE";
};
