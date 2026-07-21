import { useMutation } from "@tanstack/react-query";
import { registerUser, type RegisterPayload } from "../auth";
import { ApiError } from "../client";

// Мутация регистрации (Шаг 1): отправляет заявку и триггерит OTP на почту.
export function useRegister() {
  return useMutation<void, ApiError, RegisterPayload>({
    mutationFn: registerUser,
  });
}
