import {
  createCrudApi,
  T_API_ERROR,
  T_API_RESPONSE,
} from "@/shared/api_v2/crud";
import { RegistrationDraft } from "../../types";
import { HTTP } from "@/shared/api_v2/http";
import { API_BASE } from "@/shared/api/config";

const BASE_URL = API_BASE;

export const PERSONAL_STEP = {
  ...createCrudApi<RegistrationDraft>({
    resource: "registrationDraft",
  }),
  CHECK_MAIL: async (mail: string): Promise<boolean> => {
    const res = await HTTP.POST<
      T_API_RESPONSE<{ exists: boolean }> | T_API_ERROR
    >({
      url: `${BASE_URL}/user/checkMail`,
      body: {
        fields: {
          email: mail,
        },
      },
    });

    if (res.statusCode === 200 && res.data?.success) {
      return res.data.data.exists;
    }

    if (res.statusCode === 200 && res.data && !res.data.success) {
      throw new Error(res.data.errorCode);
    }

    throw new Error("UNKNOWN_ERROR");
  },

  GET_ANON_TOKEN: async () => {
    const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
      url: `${BASE_URL}/auth/getAnonToken`,
      body: {
        fields: {},
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

  // CALCULATE_PACKAGE_TOTAL: async () => {
  //   const res = await HTTP.POST<T_API_RESPONSE<any> | T_API_ERROR>({
  //     url: `${BASE_URL}/calculatePackageTotal`,
  //     body: {
  //       fields: {
  //         // ...
  //       },
  //     },
  //   });

  //   if (res.statusCode === 200 && !!res.data && res.data.success) {
  //     return res.data.data;
  //   } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
  //     throw new Error(res.data.errorCode);
  //   } else {
  //     throw new Error("UNKNOWN_ERROR");
  //   }
  // },
};
