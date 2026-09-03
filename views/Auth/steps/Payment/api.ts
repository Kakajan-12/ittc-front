import { createCrudApi, type T_API_RESPONSE } from "@/shared/api/crud";
import { HTTP } from "@/shared/api/http";
import { API_BASE } from "@/shared/api/config";
import { RegistrationDraft } from "../../types";
import { T_PAYMENT } from "./type";

export const PAYMENT = createCrudApi<RegistrationDraft>({
  resource: "registration-drafts",
  searchFields: [],
  orderByFields: [],
  filterFields: [],
  updatePath: (id) => `${id}/payment-method`,
});

/**
 * Шаг 4 — оплата: пишем в черновик способ оплаты вместе с итогами, которые
 * бэкенд посчитал на предыдущих шагах. Путь в единственном числе:
 * `payment-methods` — это справочник способов, а не поле черновика.
 */
export const PAYMENT_STEP_REQUEST = async ({
  draftId,
  payload,
}: {
  draftId: string;
  payload: T_PAYMENT;
}) => {
  try {
    const baseUrl = API_BASE;
    const resource = "registration-drafts";

    const res = await HTTP.PATCH<T_API_RESPONSE<RegistrationDraft>>({
      url: `${baseUrl}/${resource}/${draftId}/payment-method`,
      body: { ...payload },
    });

    if (res.statusCode === 200 && res.data?.success) {
      return res.data.data;
    } else
      throw new Error(
        (res.data && "message" in res.data && res.data.message) ||
          "FETCH FAILED",
      );
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
