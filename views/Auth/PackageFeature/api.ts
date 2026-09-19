import { createCrudApi } from "@/shared/api_v2/crud";
import { PackageFeature } from "./type";
import { T_ENTITY } from "@/shared/api/types";

export const EVENT_PACKAGE_FEATURES = createCrudApi<PackageFeature & T_ENTITY>({
  resource: "packageFeature",
});
