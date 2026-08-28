import { createCrudApi } from "@/shared/api/crud";
import { EventPackageType } from "./type";
import { T_ENTITY } from "@/shared/api/types";

export const EVENT_PACKAGE_TYPES = createCrudApi<EventPackageType & T_ENTITY>({
  resource: "event-package-types",
  searchFields: [],
  orderByFields: [
    "titleEn",
    "titleRu",
    "titleTk",
    "status",
    "id",
    "createdAt",
    "updatedAt",
  ],
  filterFields: [
    "titleEn",
    "titleRu",
    "titleTk",
    "status",
    "id",
    "createdAt",
    "updatedAt",
  ],
});
