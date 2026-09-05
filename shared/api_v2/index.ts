import { EVENT_PACKAGES } from "@/views/Auth/EventPackages/api";
import { EVENT_PACKAGE_TYPES } from "@/views/Auth/EventPackageTypes/api";
import { PACKAGES } from "@/views/Auth/Packages/api";
import { PAYMONT_METHOD } from "@/views/Auth/PaymontMethod/api";
import { ORGANIZATION_STEP } from "@/views/Auth/steps/OrganizationStep/api";
import { PAYMENT } from "@/views/Auth/steps/Payment/api";
import { PERSONAL_STEP } from "@/views/Auth/steps/PesonalStep/api";
import { SEND_OTP, VERIFY_OTP } from "@/views/Auth/steps/VerificationStep/api";
import { COUNTRIES } from "@/views/Countries/api";

export const API_V2 = {
  COUNTRIES,
  EVENT_PACKAGE_TYPES,
  PERSONAL_STEP,
  ORGANIZATION_STEP,
  // PROMOCODE,
  EVENT_PACKAGES,
  // EVENT_SERVICES,
  PACKAGES,
  PAYMONT_METHOD,
  PAYMENT,
  // SEND_OTP,
  // VERIFY_OTP,
};
