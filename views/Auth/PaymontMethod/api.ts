import { createCrudApi } from "@/shared/api_v2/crud";
import { T_PaymentMethod } from "./type";

export const PAYMONT_METHOD = createCrudApi<T_PaymentMethod>({
  resource: "paymentMethod",
});
