import type { TabVariant } from "./StepTab";

export type Step = {
  variant: TabVariant;
  key: string;
};

// export const steps: Step[] = [
//   { variant: "1", key: "personal" },
//   { variant: "2", key: "company" },
//   { variant: "3", key: "services" },
//   { variant: "4", key: "payment" },
//   { variant: "5", key: "verification" },
// ];

// export const FIELD_IDS: Record<string, string> = {
//   firstName: "name",
//   lastName: "surname",
//   patronymicName: "patronymic",
//   email: "email",
//   phoneNumber: "phone",
//   accepted: "accept-terms",
//   organizationName: "company-name",
//   position: "position",
//   website: "company-website",
//   address: "company-address",
//   countryId: "company-country",
//   city: "city",
//   postalCode: "postal-code",
// };

// export const INITIAL_FORM_DATA = {
//   firstName: "",
//   lastName: "",
//   patronymicName: "",
//   email: "",
//   phoneNumber: "",
//   organizationName: "",
//   position: "",
//   website: "",
//   address: "",
//   countryId: "",
//   countryCode: "",
//   city: "",
//   postalCode: "",
//   promoCode: "",
//   promoCodeId: "",
//   paymentMethodId: "",
// };

// export type RegistrationFormData = typeof INITIAL_FORM_DATA;

export const OTP_LENGTH = 6;
export const RESEND_COUNTDOWN_SECONDS = 60;

export const EVENT_ID = Number(process.env.NEXT_PUBLIC_EVENT_ID ?? 1);

export const DEBUG_LOG = true;

export const STORAGE_KEYS = {
  mode: "ittc.auth.mode",
  step: "ittc.auth.step",
  formData: "ittc.auth.formData",
  personalStepForm: "ittc.auth.personalStepForm",
  accepted: "ittc.auth.accepted",
  /** Выбор пакетов: id пакета из справочника → количество */
  services: "ittc.auth.packages",
  servicesTabs: "ittc.auth.packagesTabs",
  payment: "ittc.auth.payment",
  promoApplied: "ittc.auth.promoApplied.v2",
  draftId: "ittc.auth.draftId",
  draftPersonal: "ittc.auth.draftPersonal",
  draftCompany: "ittc.auth.draftCompany",
  draftPackages: "ittc.auth.draftPackages",
  draftPayment: "ittc.auth.draftPayment",
  signInId: "ittc.auth.signInId",
} as const;

export const ALL_STORAGE_KEYS = Object.values(STORAGE_KEYS);
