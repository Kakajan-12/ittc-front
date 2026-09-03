import { createCrudApi } from "@/shared/api_v2/crud";
import { T_Package } from "./type";

export const PACKAGES = createCrudApi<T_Package>({
  resource: "registrationDraftPackage",
});
