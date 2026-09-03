import {
  createCrudApi,
  T_API_ERROR,
  T_API_RESPONSE,
} from "@/shared/api_v2/crud";
import { RegistrationDraft } from "../../types";
import { HTTP } from "@/shared/api_v2/http";

const BASE_URL = `http://104.207.74.50:3101/api/v1/registrationDraft`;

export const PERSONAL_STEP = {
  ...createCrudApi<RegistrationDraft>({
    resource: "registrationDraft",
  }),

  APPLY_PROMOCODE: async (promocode: string) => {
    const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
      url: `${BASE_URL}/applyPromoCode`,
      body: {
        fields: {
          // ...
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

  SEND_OTP: async () => {
    const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
      url: `${BASE_URL}/sendOtp`,
      body: {
        fields: {
          // ...
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

  VERIFY_OTP: async () => {
    const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
      url: `${BASE_URL}/verifyOtp`,
      body: {
        fields: {
          // ...
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

  CALCULATE_PACKAGE_TOTAL: async () => {
    const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
      url: `${BASE_URL}/calculatePackageTotal`,
      body: {
        fields: {
          // ...
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
