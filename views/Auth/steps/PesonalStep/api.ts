import { createCrudApi } from "@/shared/api/crud";
import { RegistrationDraft } from "../../types";

export const PERSONAL_STEP = createCrudApi<RegistrationDraft>({
  resource: "registration-drafts",
  searchFields: [],
  orderByFields: [],
  filterFields: [],
  updatePath: (id) => `${id}/personal-info`,
});
