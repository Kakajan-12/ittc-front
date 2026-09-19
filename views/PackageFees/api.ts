import { createCrudApi } from "@/shared/api_v2/crud";
import { T_EVENT_PACKAGE_FEE } from "./type";


export const EVENT_PACKAGE_FEES = createCrudApi<T_EVENT_PACKAGE_FEE>({
  resource: "eventPackageFee",
});

