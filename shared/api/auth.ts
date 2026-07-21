import { apiFetch } from "./client";

// Тело запроса POST /api/auth/register/
// Шаг 1: приём заявки и отправка OTP на указанную почту.
export type ParticipantType = "delegate" | "exhibitor";
export type PreferredLanguage = "tk" | "en" | "ru";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  patronymic: string;
  email: string;
  phone_number: string;
  company_name: string;
  position: string;
  company_website: string;
  participant_type: ParticipantType;
  preferred_language: PreferredLanguage;
}

// Шаг 1: отправка заявки на регистрацию → на почту приходит OTP-код.
export function registerUser(payload: RegisterPayload): Promise<void> {
  return apiFetch<void>("/auth/register/", {
    method: "POST",
    body: payload,
  });
}

// Тело запроса POST /api/auth/verify-email/
export interface VerifyEmailPayload {
  email: string;
  code: string;
}

// Шаг 2: проверка OTP-кода и отправка данных заявки модератору.
export function verifyEmail(payload: VerifyEmailPayload): Promise<void> {
  return apiFetch<void>("/auth/verify-email/", {
    method: "POST",
    body: payload,
  });
}

// Тело запроса POST /api/auth/resend-code/
export interface ResendCodePayload {
  email: string;
}

// Повторная отправка OTP-кода на почту.
export function resendCode(payload: ResendCodePayload): Promise<void> {
  return apiFetch<void>("/auth/resend-code/", {
    method: "POST",
    body: payload,
  });
}
