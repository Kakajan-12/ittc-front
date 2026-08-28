import { _Translator } from "next-intl";
import { PAYMENT_ERROR_CODE } from "./errorCodes";

export function getErrorMessage({
  t,
  errorCode,
}: {
  t: _Translator<Record<string, any>, "Registration.errors">;
  errorCode: PAYMENT_ERROR_CODE;
}) {
  return t(errorCode);
}
