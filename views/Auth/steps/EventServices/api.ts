import { HTTP } from "@/shared/api_v2/http";
import { RegistrationDraft } from "../../types";
import { EventServices } from "./type";
import { API_BASE } from "@/shared/api/config";
import { createCrudApi, T_API_RESPONSE } from "@/shared/api_v2/crud";

export const EVENT_SERVICES = createCrudApi<RegistrationDraft>({
  resource: "registrationDraft",
});

export const EVENT_SERVICE_STEP_REQUEST = async ({
  draftId,
  payload,
}: {
  draftId: number;
  payload: EventServices;
}) => {
  try {
    const baseUrl = `http://104.207.74.50:3101/api/v1`;
    const resource = "registrationDraft";

    const res = await HTTP.POST<T_API_RESPONSE<RegistrationDraft>>({
      url: `${baseUrl}/${resource}/calculatePackageTotal`,
      body: { fields: { ...payload, registrationDraftId: draftId } },
    });
    if (res.statusCode === 200 && res.data?.success) {
      return res.data.data;
    } else throw new Error("FETCH FAILED");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
