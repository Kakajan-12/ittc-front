import { createCrudApi } from "@/shared/api/crud";
import { T_PaymentMethod } from "./type";
import { HTTP } from "@/shared/api/http";

export const PAYMONT_METHOD = createCrudApi<T_PaymentMethod>({
  resource: "payment-methods",
  searchFields: [],
  orderByFields: [
    "status",
    "titleEn",
    "titleRu",
    "titleTk",
    "subtitleEn",
    "subtitleRu",
    "subtitleTk",
    "type",
  ],
  filterFields: [
    "status",

    "titleEn",
    "titleRu",
    "titleTk",
    "subtitleEn",
    "subtitleRu",
    "subtitleTk",
    "type",
  ],
  updatePath: (id) => `${id}`,
});

// export const EVENT_SERVICE_STEP_REQUEST = async ({
//   draftId,
//   payload,
// }: {
//   draftId: string;
//   payload: EventServices;
// }) => {
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//     const resource = "registration-drafts";

//     const res = await HTTP.PATCH<RegistrationDraft>({
//       url: `${baseUrl}/${resource}/${draftId}/packages`,
//       body: { ...payload },
//     });

//     if (res.data && res.statusCode === 200) {
//       return res.data;
//     } else throw new Error("FETCH FAILED");
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
