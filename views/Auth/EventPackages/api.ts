import { createCrudApi } from "@/shared/api/crud";
import { EventPackages } from "./type";
import { T_ENTITY } from "@/shared/api/types";

export const EVENT_PACKAGES = createCrudApi<EventPackages & T_ENTITY>({
  resource: "event-packages",
  searchFields: [],
  orderByFields: [
    "titleEn",
    "titleRu",
    "titleTk",
    "status",
    "id",
    "createdAt",
    "updatedAt",
    "eventPackageType",
    "eventPackageFee",
    "packageFeatures",
    "price",
    "oldPrice",
    "currency",
    "isLocal",
    "isDiscountAvailable",
  ],
  filterFields: [
    "titleEn",
    "titleRu",
    "titleTk",
    "status",
    "id",
    "createdAt",
    "updatedAt",
    "eventPackageType",
    "eventPackageFee",
    "packageFeatures",
    "price",
    "oldPrice",
    "currency",
    "isLocal",
    "isDiscountAvailable",
  ],
});
