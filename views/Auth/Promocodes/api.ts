import { createCrudApi, type T_API_RESPONSE } from "@/shared/api/crud";
import { T_Promocode } from "./type";
import { HTTP } from "@/shared/api/http";
import { API_BASE } from "@/shared/api/config";
import { RegistrationDraft } from "../types";

export const PROMOCODE = createCrudApi<T_Promocode>({
  resource: "promocodes",
  searchFields: [],
  orderByFields: [
    "code",
    "status",
    "discountType",
    "discountValue",
    "startDate",
    "expiredAt",
    "eventPackageTypeId",
    "id",
    "createdAt",
    "updatedAt",
  ],
  filterFields: [
    "code",
    "status",
    "discountType",
    "discountValue",
    "startDate",
    "expiredAt",
    "eventPackageTypeId",
    "id",
    "createdAt",
    "updatedAt",
  ],
  updatePath: (id) => `${id}`,
});

export const APPLY_PROMOCODE_REQUEST = async ({
  draftId,
  code,
}: {
  draftId: string;
  code: string;
}) => {
  const baseUrl = API_BASE;
  const resource = "registration-drafts";

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
