import { _Translator } from "next-intl";
import { EVENT_SERVICES_ERROR_CODE } from "./errorCodes";

export function getErrorMessage({
  t,
  errorCode,
}: {
  t: _Translator<Record<string, any>, "Registration.errors">;
  errorCode: EVENT_SERVICES_ERROR_CODE;
}) {
  return t(errorCode);
}
