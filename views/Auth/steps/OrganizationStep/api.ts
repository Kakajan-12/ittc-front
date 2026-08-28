import { createCrudApi } from "@/shared/api/crud";
import { RegistrationDraft } from "../../types";

export const ORGANIZATION_STEP = createCrudApi<RegistrationDraft>({
  resource: `registration-drafts`,
  searchFields: [],
  orderByFields: [],
  filterFields: [],
  updatePath: (id) => `${id}/organization-info`,
});
