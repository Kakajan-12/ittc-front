import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";
import { usePersistentState } from "@/shared/lib/usePersistentState";

// prettier-ignore
import { OTP_LENGTH, STORAGE_KEYS } from "@/views/Auth/config";
import { VERIFY_OTP } from "./api";
import { C_SENT_INFO_KEY, T_SEND_OTP, T_VERIFY_EMAIL } from "./type";
import { verificationSchema } from "./validation";
import { VERIFICATION_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import { useRegistrationDraft } from "@/views/Auth/draft";

const initialCode = () => Array<string>(OTP_LENGTH).fill("");

type UseVerificationStepProps = {
  t: _Translator<Record<string, any>, "Registration.errors">;
  id?: number;
};

export function useVerificationStep({ t, id }: UseVerificationStepProps) {
  // prettier-ignore
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const draftId = id ?? storedDraftId;
  const [code, setCode] = useState<string[]>(initialCode);
  const [error, setError] = useState("");
  const email = useRegistrationDraft()?.email ?? "";

  //--------------------------------------------------------------
  // VERIFY OTP
  //--------------------------------------------------------------
  const verifyMutation = useMutation({
    mutationFn: async ({
      draftId,
      payload,
    }: {
      draftId: number;
      payload: T_VERIFY_EMAIL;
    }) => {
      return VERIFY_OTP({ draftId, payload });
    },
  });

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setError("");
      if (!draftId) throw new Error(VERIFICATION_ERROR_CODE.DRAFT_IS_REQUIRED);

      const result = verificationSchema.safeParse({ otp: code.join("") });
      if (!result.success) throw result.error;

      const sentInfo = getSentInfo();
      if (!sentInfo) throw new Error(VERIFICATION_ERROR_CODE.SEND_EMAIL_FAILED);

      await verifyMutation.mutateAsync({
        draftId,
        payload: {
          otp: result.data.otp,
          revId: sentInfo.revId,
        },
      });

      sessionStorage.removeItem(C_SENT_INFO_KEY);
      setCode(initialCode());
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];

        setError(
          getErrorMessage({
            t,
            errorCode: firstError.message as VERIFICATION_ERROR_CODE,
          }),
        );
      } else if (error instanceof Error) {
        setError(
          isErrorCode(error.message)
            ? getErrorMessage({
                t,
                errorCode: error.message,
              })
            : error.message,
        );
      }

      return false;
    }
  }, [code, verifyMutation, t]);

  //--------------------------------------------------------------
  // EXPORT
  //--------------------------------------------------------------

  return {
    draftId,
    email,
    code,
    setCode,
    handleSubmit,
    isSubmitting: verifyMutation.isPending,
    error,
  };
}

function getSentInfo(): T_SEND_OTP | null {
  if (typeof window === "undefined") return null;

  const value = sessionStorage.getItem(C_SENT_INFO_KEY);

  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as T_SEND_OTP;

    if (typeof parsed.revId !== "number") {
      sessionStorage.removeItem(C_SENT_INFO_KEY);
      return null;
    }

    return parsed;
  } catch {
    sessionStorage.removeItem(C_SENT_INFO_KEY);
    return null;
  }
}

function isErrorCode(message: string): message is VERIFICATION_ERROR_CODE {
  return Object.values(VERIFICATION_ERROR_CODE).includes(
    message as VERIFICATION_ERROR_CODE,
  );
}
