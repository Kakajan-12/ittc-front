import { type T_API_RESPONSE } from "@/shared/api/crud";
import { HTTP } from "@/shared/api/http";
import { API_BASE } from "@/shared/api/config";
import { T_COMPLETED_REGISTRATION, T_VERIFY_EMAIL } from "./type";
import { VERIFICATION_ERROR_CODE } from "./errorCodes";
import { RegistrationDraft } from "../../types";

const BASE_URL = API_BASE;
const RESOURCE = "registration-drafts";

const KNOWN_ERROR_CODES = new Set<string>(
  Object.values(VERIFICATION_ERROR_CODE),
);

function toRequestError(
  data: unknown,

  fallbackError: VERIFICATION_ERROR_CODE,
): Error {
  if (data && typeof data === "object") {
    const { errorCode, message } = data as {
      errorCode?: unknown;

      message?: unknown;
    };

    if (typeof errorCode === "string" && KNOWN_ERROR_CODES.has(errorCode)) {
      return new Error(errorCode);
    }

    if (typeof message === "string" && message) {
      return new Error(message);
    }
  }

  return new Error(fallbackError);
}

async function postToDraft<T>({
  draftId,

  path,

  body,

  fallbackError,
}: {
  draftId: number;

  path: string;

  body: unknown;

  fallbackError: VERIFICATION_ERROR_CODE;
}): Promise<T> {
  const res = await HTTP.POST<T_API_RESPONSE<T>>({
    url: `${BASE_URL}/${RESOURCE}/${draftId}/${path}`,

    body,
  });

  if ((res.statusCode === 200 || res.statusCode === 201) && res.data?.success) {
    return res.data.data;
  }

  throw toRequestError(res.data, fallbackError);
}

export const SEND_EMAIL_REQUEST = ({ draftId }: { draftId: number }) =>
  postToDraft<RegistrationDraft>({
    draftId,
    path: "email/send",
    body: {},
    fallbackError: VERIFICATION_ERROR_CODE.SEND_EMAIL_FAILED,
  });

export const VERIFY_EMAIL_REQUEST = ({
  draftId,

  payload,
}: {
  draftId: number;

  payload: T_VERIFY_EMAIL;
}) =>
  postToDraft<RegistrationDraft>({
    draftId,
    path: "email/verify",
    body: payload,
    fallbackError: VERIFICATION_ERROR_CODE.VERIFY_EMAIL_FAILED,
  });

export const COMPLETE_REGISTRATION_REQUEST = ({
  draftId,
}: {
  draftId: number;
}) =>
  postToDraft<T_COMPLETED_REGISTRATION>({
    draftId,

    path: "complete",

    body: {},

    fallbackError: VERIFICATION_ERROR_CODE.COMPLETE_REGISTRATION_FAILED,
  });
