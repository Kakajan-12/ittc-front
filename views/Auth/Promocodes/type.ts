import { T_ENTITY } from "@/shared/api/types";

export type T_DiscountType = "PERCENTAGE" | "FIXED";

export type T_Promocode = T_ENTITY & {
  code: string;
  usageLimit: number | null;
  discountType: T_DiscountType;
  discountValue: number;
  eventPackageTypeId: number | null;
  startDate: string | null;
  expiredAt: string | null;
  status: string;

  // usageCount: number;
  // perUserLimit: number | null;
  // eventPackageType: EventPackageType | null;
};
