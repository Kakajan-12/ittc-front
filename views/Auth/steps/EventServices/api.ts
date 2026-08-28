import { createCrudApi, type T_API_RESPONSE } from "@/shared/api/crud";
import { RegistrationDraft } from "../../types";
import { EventServices } from "./type";
import { HTTP } from "@/shared/api/http";

export const EVENT_SERVICES = createCrudApi<RegistrationDraft>({
  resource: "registration-drafts",
  searchFields: [],
  orderByFields: [],
  filterFields: [],
  updatePath: (id) => `${id}/packages`,
});

export const EVENT_SERVICE_STEP_REQUEST = async ({
  draftId,
  payload,
}: {
  draftId: string;
  payload: EventServices;
}) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const resource = "registration-drafts";

    const res = await HTTP.PATCH<T_API_RESPONSE<RegistrationDraft>>({
      url: `${baseUrl}/${resource}/${draftId}/packages`,
      body: { ...payload },
    });
    if (res.statusCode === 200 && res.data?.success) {
      return res.data.data;
    } else throw new Error("FETCH FAILED");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
