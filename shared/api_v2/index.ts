import { AGENDA } from "@/views/Agenda/api";
import { EVENT_PACKAGES } from "@/views/Auth/EventPackages/api";
import { EVENT_PACKAGE_TYPES } from "@/views/Auth/EventPackageTypes/api";
import { PACKAGES } from "@/views/Auth/Packages/api";
import { PAYMONT_METHOD } from "@/views/Auth/PaymontMethod/api";
import { INSTITUTION_STEP } from "@/views/Auth/steps/Institution/api";
import { ORGANIZATION_STEP } from "@/views/Auth/steps/OrganizationStep/api";
import { PAYMENT } from "@/views/Auth/steps/Payment/api";
import { PERSONAL_STEP } from "@/views/Auth/steps/PesonalStep/api";
import { COUNTRIES } from "@/views/Countries/api";
import { EVENT_PACKAGE_FEES } from "@/views/PackageFees/api";

export const API_V2 = {
  COUNTRIES,
  EVENT_PACKAGE_TYPES,
  PERSONAL_STEP,
  ORGANIZATION_STEP,
  EVENT_PACKAGE_FEES,
  AGENDA,
  EVENT_PACKAGES,
  PACKAGES,
  PAYMONT_METHOD,
  PAYMENT,
  INSTITUTION_STEP,
};
