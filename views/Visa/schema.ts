import * as z from "zod";
import { phoneErrorMessage } from "@/shared/lib/phone";
import { VISA_ERROR_CODE } from "./types";

const text = (tooSmall: VISA_ERROR_CODE, tooBig: VISA_ERROR_CODE, max = 50) =>
  z.string().trim().min(2, tooSmall).max(max, tooBig);

const required = (code: VISA_ERROR_CODE) => z.string().trim().min(1, code);

const toDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const notFutureDate = (missing: VISA_ERROR_CODE, future: VISA_ERROR_CODE) =>
  required(missing).refine((value) => {
    const date = toDate(value);
    return !!date && date <= startOfToday();
  }, future);

export const VISA_SCHEMA = z.object({
  // Personal Information
  firstName: text(
    VISA_ERROR_CODE.NAME_IS_TOO_SMALL,
    VISA_ERROR_CODE.NAME_IS_TOO_BIG,
  ),
  surname: text(
    VISA_ERROR_CODE.SURNAME_IS_TOO_SMALL,
    VISA_ERROR_CODE.SURNAME_IS_TOO_BIG,
  ),
  gender: required(VISA_ERROR_CODE.GENDER_IS_REQUIRED),
  maritalStatus: required(VISA_ERROR_CODE.MARITAL_STATUS_IS_REQUIRED),
  birthDate: notFutureDate(
    VISA_ERROR_CODE.BIRTH_DATE_IS_REQUIRED,
    VISA_ERROR_CODE.BIRTH_DATE_IS_IN_FUTURE,
  ),
  // Optional — validated only when the user typed something
  surnameOfBirth: z
    .string()
    .trim()
    .max(50, VISA_ERROR_CODE.SURNAME_OF_BIRTH_IS_TOO_BIG)
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      VISA_ERROR_CODE.SURNAME_OF_BIRTH_IS_TOO_SMALL,
    ),

  // Contact & Address
  citizenship: required(VISA_ERROR_CODE.CITIZENSHIP_IS_REQUIRED),
  country: required(VISA_ERROR_CODE.COUNTRY_IS_REQUIRED),
  placeOfBirth: z
    .string()
    .trim()
    .min(2, VISA_ERROR_CODE.PLACE_OF_BIRTH_IS_TOO_SMALL),
  address: z.string().trim().min(5, VISA_ERROR_CODE.ADDRESS_IS_TOO_SMALL),
  email: z.email(VISA_ERROR_CODE.EMAIL_IS_INVALID),
  // The widget stores the number in E.164 ("+99361234567"); the message is
  // built per country — it names the expected digit count — so it goes through
  // as-is instead of via VISA_ERROR_MESSAGE.
  phone: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      const message = phoneErrorMessage(value);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
  residentialAddress: z
    .string()
    .trim()
    .min(5, VISA_ERROR_CODE.RESIDENTIAL_ADDRESS_IS_TOO_SMALL),

  // Passport Info
  passportType: required(VISA_ERROR_CODE.PASSPORT_TYPE_IS_REQUIRED),
  passportNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9 ]{6,20}$/, VISA_ERROR_CODE.PASSPORT_NUMBER_IS_INVALID),
  dateIssue: notFutureDate(
    VISA_ERROR_CODE.DATE_ISSUE_IS_REQUIRED,
    VISA_ERROR_CODE.DATE_ISSUE_IS_IN_FUTURE,
  ),
  expiry: required(VISA_ERROR_CODE.EXPIRY_IS_REQUIRED).refine((value) => {
    const date = toDate(value);
    if (!date) return false;
    const min = startOfToday();
    min.setMonth(min.getMonth() + 6);
    return date >= min;
  }, VISA_ERROR_CODE.EXPIRY_IS_TOO_SOON),
  placeOfIssue: required(VISA_ERROR_CODE.PLACE_OF_ISSUE_IS_REQUIRED),

  // Work & Education
  education: z.string().trim().min(2, VISA_ERROR_CODE.EDUCATION_IS_TOO_SMALL),
  speciality: z.string().trim().min(2, VISA_ERROR_CODE.SPECIALITY_IS_TOO_SMALL),
  placeOfEducation: z
    .string()
    .trim()
    .min(2, VISA_ERROR_CODE.PLACE_OF_EDUCATION_IS_TOO_SMALL),
  placeOfWork: z
    .string()
    .trim()
    .min(2, VISA_ERROR_CODE.PLACE_OF_WORK_IS_TOO_SMALL),
  position: z.string().trim().min(2, VISA_ERROR_CODE.POSITION_IS_TOO_SMALL),
  experience: z
    .string()
    .trim()
    .refine((value) => {
      const years = Number(value);
      return (
        value !== "" && Number.isFinite(years) && years >= 0 && years <= 70
      );
    }, VISA_ERROR_CODE.EXPERIENCE_IS_INVALID),
});

export type VisaFormValues = z.infer<typeof VISA_SCHEMA>;
