import { createCrudApi } from "@/shared/api_v2/crud";
import { EventPackages } from "./type";

export const EVENT_PACKAGES = createCrudApi<EventPackages>({
  resource: "eventPackage",
});
