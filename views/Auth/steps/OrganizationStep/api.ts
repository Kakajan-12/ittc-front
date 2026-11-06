import {
  createCrudApi,
  T_API_ERROR,
  T_API_RESPONSE,
} from "@/shared/api_v2/crud";
import { RegistrationDraft } from "../../types";
import { HTTP } from "@/shared/api_v2/http";
import { API_BASE } from "@/shared/api/config";

const BASE_URL = API_BASE;

export const ORGANIZATION_STEP = {
  ...createCrudApi<RegistrationDraft>({
    resource: "registrationDraft",
  }),
  CHECK_ORGANIZATION: async (
    organizationName: string,
  ): Promise<{ exists: boolean }> => {
    const res = await HTTP.POST<
      T_API_RESPONSE<{ id: number; name: string }> | T_API_ERROR
    >({
      url: `${BASE_URL}/organization/checkOrganization`,
      body: {
        fields: {
          name: organizationName.trim(),
        },
      },
    });

    if (res.data?.success) {
      return { exists: true };
    }

    if (res.data && res.data.errorCode === "DOES-NOT-EXIST") {
      return { exists: false };
    }

    throw new Error(res.data?.errorCode ?? "UNKNOWN_ERROR");
  },
};
