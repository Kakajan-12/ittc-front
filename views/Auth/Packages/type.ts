import { T_ENTITY } from "@/shared/api/types";

export type T_Package = T_ENTITY & {
  registrationDraftId: number;
  eventPackageId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};
