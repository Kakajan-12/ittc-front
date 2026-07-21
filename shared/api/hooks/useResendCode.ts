import { useMutation } from "@tanstack/react-query";
import { resendCode, type ResendCodePayload } from "../auth";
import { ApiError } from "../client";

// Мутация повторной отправки OTP-кода на почту.
export function useResendCode() {
  return useMutation<void, ApiError, ResendCodePayload>({
    mutationFn: resendCode,
  });
}
