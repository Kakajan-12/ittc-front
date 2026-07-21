import { useMutation } from "@tanstack/react-query";
import { verifyEmail, type VerifyEmailPayload } from "../auth";
import { ApiError } from "../client";

// Мутация верификации (Шаг 2): проверяет OTP и отправляет заявку модератору.
export function useVerifyEmail() {
  return useMutation<void, ApiError, VerifyEmailPayload>({
    mutationFn: verifyEmail,
  });
}
