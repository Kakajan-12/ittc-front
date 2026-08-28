import { _Translator } from "next-intl";
import { VERIFICATION_ERROR_CODE } from "./errorCodes";

export function getErrorMessage({
  t,
  errorCode,
}: {
  t: _Translator<Record<string, any>, "Registration.errors">;
  errorCode: VERIFICATION_ERROR_CODE;
}) {
  return t(errorCode);
}
