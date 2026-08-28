import { _Translator } from "next-intl";
import { ORGANIZATION_STEP_ERROR_CODE } from "./errorCodes";

export function getErrorMessage({
  t,
  errorCode,
}: {
  t: _Translator<Record<string, any>, "Registration.organization">;
  errorCode: ORGANIZATION_STEP_ERROR_CODE;
}) {
  return t(errorCode);
}
