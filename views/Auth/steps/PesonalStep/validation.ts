import { z } from "zod";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";
import { phoneErrorMessage } from "@/shared/lib/phone";

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
  patronymicName: z
    .string()
    .nullable()
    .optional()
    .transform((value) => value?.trim() || null),
  email: z.email(PERSONAL_STEP_ERROR_CODE.EMAIL_IS_INVALID),
  // Виджет хранит номер в E.164 ("+99361234567"); сообщение строится под
  // страну — называет ожидаемое число цифр — поэтому идёт как есть, минуя
  // PERSONAL_STEP_ERROR_CODE (см. `useErrorText`).
  phoneNumber: z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      const message = phoneErrorMessage(value);
      if (message) ctx.addIssue({ code: "custom", message });
    }),
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
