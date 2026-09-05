import { HTTP } from "@/shared/api_v2/http";
import { RegistrationDraft } from "../../types";
import { T_PAYMENT } from "./type";
import {
  createCrudApi,
  T_API_ERROR,
  T_API_RESPONSE,
} from "@/shared/api_v2/crud";
import { PACKAGES } from "../../Packages/api";

const BASE_URL = `http://104.207.74.50:3101/api/v1`;
const resource = "registrationDraft";

export const PAYMENT = {
  ...createCrudApi<RegistrationDraft>({
    resource: resource,
  }),
  // Пакеты, выбранные конкретным драфтом (registrationDraftPackage)
  DRAFT_PACKAGES_LIST: ({
    draftId,
    offset = 0,
    limit = 100,
  }: {
    draftId: number;
    offset?: number;
    limit?: number;
  }) =>
    PACKAGES.LIST({
      offset,
      limit,
      filter: {
        registrationDraftId: { op: "=", val: draftId },
      },
    }),

  APPLY_PROMOCODE: async ({
    draftId,
    code,
  }: {
    draftId: number;
    code: string;
  }) => {
    const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
      url: `${BASE_URL}/${resource}/applyPromoCode`,
      body: {
        fields: {
          registrationDraftId: draftId,
          code,
        },
      },
    });

    if (res.statusCode === 200 && !!res.data && res.data.success) {
      return res.data.data;
    } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
      throw new Error(res.data.errorCode);
    } else {
      throw new Error("UNKNOWN_ERROR");
    }
  },
};

export const PAYMENT_STEP_REQUEST = async ({
  draftId,
  payload,
}: {
  draftId: number;
  payload: T_PAYMENT;
}) => {
  try {
    const baseUrl = `http://104.207.74.50:3101/api/v1`;
    const resource = "registrationDraft";
    // /payment-method
    const res = await HTTP.POST<T_API_RESPONSE<RegistrationDraft>>({
      url: `${baseUrl}/${resource}/update`,
      body: {
        fields: {
          ...payload,
          id: draftId,
        },
      },
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

export const APPLY_PROMOCODE_REQUEST = async ({
  draftId,
  code,
}: {
  draftId: string;
  code: string;
}) => {
  const baseUrl = BASE_URL;
  const resource = "registrationDrafts";

  const res = await HTTP.POST<T_API_RESPONSE<RegistrationDraft>>({
    url: `${baseUrl}/${resource}/${draftId}/apply-promocode`,
    body: { code },
  });

  if ((res.statusCode === 200 || res.statusCode === 201) && res.data?.success) {
    return res.data.data;
  }

  throw new Error(
    (res.data && "message" in res.data && res.data.message) ||
      "APPLY_PROMOCODE_FAILED",
  );
};
