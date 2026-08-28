import { z } from "zod";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";

export const personalStepSchema = z.object({
  eventId: z.number(),
  firstName: z
    .string()
    .min(2, PERSONAL_STEP_ERROR_CODE.NAME_IS_TOO_SMALL)
    .max(50, PERSONAL_STEP_ERROR_CODE.NAME_IS_TOO_BIG),
  lastName: z
    .string()
    .min(2, PERSONAL_STEP_ERROR_CODE.SURNAME_IS_TOO_SMALL)
    .max(50, PERSONAL_STEP_ERROR_CODE.SURNAME_IS_TOO_BIG),
  /**
   * Необязательное поле. Пустое значение приводится к `null`: пустую строку
   * бэкенд отклоняет ("patronymicName: Value is required").
   */
  patronymicName: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value?.trim() || null),
  email: z.email(PERSONAL_STEP_ERROR_CODE.EMAIL_IS_INVALID),
  phoneNumber: z
    .string()
    .min(2, PERSONAL_STEP_ERROR_CODE.PHONE_NUMBER_IS_INVALID),
  position: z
    .string()
    .min(2, PERSONAL_STEP_ERROR_CODE.POSITION_IS_TOO_SMALL)
    .max(50, PERSONAL_STEP_ERROR_CODE.POSITION_IS_TOO_BIG),
  privacyPolicyAccepted: z.literal(
    true,
    PERSONAL_STEP_ERROR_CODE.TERMS_ARE_NOT_ACCEPTED,
  ),
  termsAndConditionsAccepted: z.literal(
    true,
    PERSONAL_STEP_ERROR_CODE.PRIVACY_POLICY_NOT_ACCEPTED,
  ),
});

export type PersonalStepRequest = z.infer<typeof personalStepSchema>;
