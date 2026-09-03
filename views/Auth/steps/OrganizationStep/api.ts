import { createCrudApi } from "@/shared/api_v2/crud";
import { RegistrationDraft } from "../../types";

export const ORGANIZATION_STEP = {
  ...createCrudApi<RegistrationDraft>({
    resource: "registrationDraft",
  }),
};
