import { createCrudApi } from "@/shared/api/crud";
import { T_Package } from "./type";
import { T_ENTITY } from "@/shared/api/types";

export const PACKAGES = createCrudApi<T_Package & T_ENTITY>({
  resource: "registration-drafts",
  searchFields: [],
  orderByFields: [
    "registrationDraftId",
    "eventPackageId",
    "quantity",
    "unitPrice",
    "totalPrice",
  ],
  filterFields: [
    "registrationDraftId",
    "eventPackageId",
    "quantity",
    "unitPrice",
    "totalPrice",
  ],
});
