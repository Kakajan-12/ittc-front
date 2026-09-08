import { T_ENTITY } from "@/shared/api/types";

export type T_DiscountType = "PERCENTAGE" | "FIXED";

export type T_Promocode = T_ENTITY & {
  code: string;
  startAt: string | null;
  expiredAt: string | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  discountType: T_DiscountType;
  discountValue: number;
  eventPackageTypeId: number | null;
  status: string;

  // usageCount: number;
  // eventPackageType: EventPackageType | null;
};
