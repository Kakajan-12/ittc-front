import { createCrudApi } from "@/shared/api/crud";
import { PackageFeature } from "./type";
import { T_ENTITY } from "@/shared/api/types";

export const EVENT_PACKAGE_FEATURES = createCrudApi<PackageFeature & T_ENTITY>({
  resource: "event-package-features",
  searchFields: [],
  orderByFields: [],
  filterFields: [],
});
