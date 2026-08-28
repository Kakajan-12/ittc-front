import type { SelectFieldOption } from "@/shared/ui/SelectField";
export type Section = {
  id: string;
  title: string;
  /** File drop areas rendered above the section's fields */
  uploads?: {
    id: string;
    title: string;
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
    label: string;
    type?: string;
    placeholder?: string;
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

/** Code → text shown under the field */
export const VISA_ERROR_MESSAGE: Record<VISA_ERROR_CODE, string> = {
  [VISA_ERROR_CODE.NAME_IS_TOO_SMALL]: "Name must be at least 2 characters",
  [VISA_ERROR_CODE.NAME_IS_TOO_BIG]: "Name must be at most 50 characters",
  [VISA_ERROR_CODE.SURNAME_IS_TOO_SMALL]:
    "Surname must be at least 2 characters",
  [VISA_ERROR_CODE.SURNAME_IS_TOO_BIG]: "Surname must be at most 50 characters",
  [VISA_ERROR_CODE.GENDER_IS_REQUIRED]: "Select gender",
  [VISA_ERROR_CODE.MARITAL_STATUS_IS_REQUIRED]: "Select marital status",
  [VISA_ERROR_CODE.BIRTH_DATE_IS_REQUIRED]: "Select date of birth",
  [VISA_ERROR_CODE.BIRTH_DATE_IS_IN_FUTURE]:
    "Date of birth cannot be in the future",
  [VISA_ERROR_CODE.SURNAME_OF_BIRTH_IS_TOO_SMALL]:
    "Surname of birth must be at least 2 characters",
  [VISA_ERROR_CODE.SURNAME_OF_BIRTH_IS_TOO_BIG]:
    "Surname of birth must be at most 50 characters",

  [VISA_ERROR_CODE.CITIZENSHIP_IS_REQUIRED]: "Select country of citizenship",
  [VISA_ERROR_CODE.COUNTRY_IS_REQUIRED]: "Select country of birth",
  [VISA_ERROR_CODE.PLACE_OF_BIRTH_IS_TOO_SMALL]: "Enter city of birth",
  [VISA_ERROR_CODE.ADDRESS_IS_TOO_SMALL]: "Enter your personal address",
  [VISA_ERROR_CODE.EMAIL_IS_INVALID]: "Enter a valid email address",
  [VISA_ERROR_CODE.PHONE_IS_TOO_SMALL]: "Enter a valid phone number",
  [VISA_ERROR_CODE.RESIDENTIAL_ADDRESS_IS_TOO_SMALL]:
    "Enter the planned residential address",

  [VISA_ERROR_CODE.PASSPORT_TYPE_IS_REQUIRED]: "Select passport type",
  [VISA_ERROR_CODE.PASSPORT_NUMBER_IS_INVALID]:
    "Enter a valid passport number (6–20 letters or digits)",
  [VISA_ERROR_CODE.DATE_ISSUE_IS_REQUIRED]: "Select passport date of issue",
  [VISA_ERROR_CODE.DATE_ISSUE_IS_IN_FUTURE]:
    "Date of issue cannot be in the future",
  [VISA_ERROR_CODE.EXPIRY_IS_REQUIRED]: "Select passport expiry date",
  [VISA_ERROR_CODE.EXPIRY_IS_TOO_SOON]:
    "Passport must stay valid for at least 6 more months",
  [VISA_ERROR_CODE.PLACE_OF_ISSUE_IS_REQUIRED]: "Select place of issue",

  [VISA_ERROR_CODE.EDUCATION_IS_TOO_SMALL]: "Enter your education",
  [VISA_ERROR_CODE.SPECIALITY_IS_TOO_SMALL]: "Enter your speciality",
  [VISA_ERROR_CODE.PLACE_OF_EDUCATION_IS_TOO_SMALL]:
    "Enter your place of education",
  [VISA_ERROR_CODE.PLACE_OF_WORK_IS_TOO_SMALL]: "Enter your place of work",
  [VISA_ERROR_CODE.POSITION_IS_TOO_SMALL]: "Enter your position",
  [VISA_ERROR_CODE.EXPERIENCE_IS_INVALID]:
    "Experience must be a number between 0 and 70",
};
