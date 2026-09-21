import type { SelectFieldOption } from "@/shared/ui/SelectField";
export type Section = {
  id: string;
  /** File drop areas rendered above the section's fields */
  uploads?: {
    id: string;
    /** CSS aspect-ratio of the drop area, e.g. `"5 / 6"` */
    aspect?: string;
    /** Max width of the drop area in px */
    width?: number;
    /** Faded sample picture shown while the box is empty */
    sample?: string;
    accept?: string;
    optional?: boolean;
  }[];
  fields?: {
    id: string;
    type?: string;
    optional?: boolean;
    options?: SelectFieldOption[];
    notFuture?: boolean;
    notPast?: boolean;
    minMonthsAhead?: number;
  }[];
};

export enum VISA_ERROR_CODE {
  // Personal
  NAME_IS_TOO_SMALL = "NAME_IS_TOO_SMALL",
  NAME_IS_TOO_BIG = "NAME_IS_TOO_BIG",
  SURNAME_IS_TOO_SMALL = "SURNAME_IS_TOO_SMALL",
  SURNAME_IS_TOO_BIG = "SURNAME_IS_TOO_BIG",
  GENDER_IS_REQUIRED = "GENDER_IS_REQUIRED",
  MARITAL_STATUS_IS_REQUIRED = "MARITAL_STATUS_IS_REQUIRED",
  BIRTH_DATE_IS_REQUIRED = "BIRTH_DATE_IS_REQUIRED",
  BIRTH_DATE_IS_IN_FUTURE = "BIRTH_DATE_IS_IN_FUTURE",
  SURNAME_OF_BIRTH_IS_TOO_SMALL = "SURNAME_OF_BIRTH_IS_TOO_SMALL",
  SURNAME_OF_BIRTH_IS_TOO_BIG = "SURNAME_OF_BIRTH_IS_TOO_BIG",

  // Contact & address
  CITIZENSHIP_IS_REQUIRED = "CITIZENSHIP_IS_REQUIRED",
  COUNTRY_IS_REQUIRED = "COUNTRY_IS_REQUIRED",
  PLACE_OF_BIRTH_IS_TOO_SMALL = "PLACE_OF_BIRTH_IS_TOO_SMALL",
  ADDRESS_IS_TOO_SMALL = "ADDRESS_IS_TOO_SMALL",
  EMAIL_IS_INVALID = "EMAIL_IS_INVALID",
  PHONE_IS_TOO_SMALL = "PHONE_IS_TOO_SMALL",
  RESIDENTIAL_ADDRESS_IS_TOO_SMALL = "RESIDENTIAL_ADDRESS_IS_TOO_SMALL",

  // Passport
  PASSPORT_TYPE_IS_REQUIRED = "PASSPORT_TYPE_IS_REQUIRED",
  PASSPORT_NUMBER_IS_INVALID = "PASSPORT_NUMBER_IS_INVALID",
  DATE_ISSUE_IS_REQUIRED = "DATE_ISSUE_IS_REQUIRED",
  DATE_ISSUE_IS_IN_FUTURE = "DATE_ISSUE_IS_IN_FUTURE",
  EXPIRY_IS_REQUIRED = "EXPIRY_IS_REQUIRED",
  EXPIRY_IS_TOO_SOON = "EXPIRY_IS_TOO_SOON",
  PLACE_OF_ISSUE_IS_REQUIRED = "PLACE_OF_ISSUE_IS_REQUIRED",

  // Work & education
  EDUCATION_IS_TOO_SMALL = "EDUCATION_IS_TOO_SMALL",
  SPECIALITY_IS_TOO_SMALL = "SPECIALITY_IS_TOO_SMALL",
  PLACE_OF_EDUCATION_IS_TOO_SMALL = "PLACE_OF_EDUCATION_IS_TOO_SMALL",
  PLACE_OF_WORK_IS_TOO_SMALL = "PLACE_OF_WORK_IS_TOO_SMALL",
  POSITION_IS_TOO_SMALL = "POSITION_IS_TOO_SMALL",
  EXPERIENCE_IS_INVALID = "EXPERIENCE_IS_INVALID",
}

/**
 * Code → translation key. `useErrorText` resolves it against messages/*.json,
 * so the text under the field follows the page language. Built from the enum
 * rather than written out, which makes a missing key impossible.
 */
export const VISA_ERROR_MESSAGE = Object.fromEntries(
  Object.values(VISA_ERROR_CODE).map((code) => [code, `Visa.errors.${code}`]),
) as Record<VISA_ERROR_CODE, string>;
