import { T_ENTITY } from "@/shared/api/types";
import { EventPackageType } from "../EventPackageTypes/type";

export type T_DiscountType = "PERCENTAGE" | "FIXED";

export type T_Promocode = T_ENTITY & {
  code: string;
  startDate: string | null;
  expiredAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  perUserLimit: number | null;
  discountType: T_DiscountType;
  discountValue: number;
  status: string;
  eventPackageTypeId: number | null;
  eventPackageType: EventPackageType | null;
};
