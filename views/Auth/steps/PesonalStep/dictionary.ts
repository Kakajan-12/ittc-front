import { _Translator } from "next-intl";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";

export function getErrorMessage({
  t,
  errorCode,
}: {
  t: _Translator<Record<string, any>, "Registration.personal">;
  errorCode: PERSONAL_STEP_ERROR_CODE;
}) {
  return t(errorCode);
}
