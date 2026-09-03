import { createCrudApi } from "@/shared/api_v2/crud";
import { EventPackageType } from "./type";

export const EVENT_PACKAGE_TYPES = createCrudApi<EventPackageType>({
  resource: "eventPackageType",
});
