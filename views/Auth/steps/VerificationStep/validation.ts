import { z } from "zod";
import { OTP_LENGTH } from "@/views/Auth/config";
import { VERIFICATION_ERROR_CODE } from "./errorCodes";

export const verificationSchema = z.object({
  otp: z
    .string(VERIFICATION_ERROR_CODE.OTP_IS_REQUIRED)
    .trim()
    .length(OTP_LENGTH, VERIFICATION_ERROR_CODE.OTP_IS_INVALID)
    .regex(/^\d+$/, VERIFICATION_ERROR_CODE.OTP_IS_INVALID),
});

export type VerificationRequest = z.infer<typeof verificationSchema>;
