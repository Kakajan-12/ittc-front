import { z } from "zod";
import { PAYMENT_ERROR_CODE } from "./errorCodes";

const amount = z.number().nonnegative().optional();

export const paymentSchema = z.object({
  paymentMethodId: z
    .number(PAYMENT_ERROR_CODE.PAYMENT_METHOD_IS_REQUIRED)
    .min(1, PAYMENT_ERROR_CODE.PAYMENT_METHOD_IS_REQUIRED),

  promocodeId: z.number().nullable().optional(),
  promocodeCode: z.string().nullable().optional(),

  subtotalUsd: amount,
  subtotalTmt: amount,
  discountAmountUsd: amount,
  discountAmountTmt: amount,
  totalAmountUsd: amount,
  totalAmountTmt: amount,
});

export type PaymentRequest = z.infer<typeof paymentSchema>;
