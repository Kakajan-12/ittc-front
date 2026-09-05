import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useMutation } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";

import {
  clearPersisted,
  usePersistentState,
} from "@/shared/lib/usePersistentState";
import {
  OTP_LENGTH,
  RESEND_COUNTDOWN_SECONDS,
  STORAGE_KEYS,
} from "@/views/Auth/config";

import {
  COMPLETE_REGISTRATION_REQUEST,
  // COMPLETE_REGISTRATION_REQUEST,
  SEND_OTP,
  VERIFY_OTP,
} from "./api";

import { T_COMPLETED_REGISTRATION, T_VERIFY_EMAIL } from "./type";

import { verificationSchema } from "./validation";
import { VERIFICATION_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import type { RegistrationDraft } from "../../types";

const initialCode = () => Array<string>(OTP_LENGTH).fill("");

function subscribeToDraft(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "eventDraft") onChange();
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function getDraftEmail() {
  try {
    const rawDraft = localStorage.getItem("eventDraft");
    if (!rawDraft) return "";

    return (JSON.parse(rawDraft) as RegistrationDraft).email ?? "";
  } catch {
    return "";
  }
}

type UseVerificationStepProps = {
  t: _Translator<Record<string, any>, "Registration.errors">;
  id?: number;
};

export function useVerificationStep({ t, id }: UseVerificationStepProps) {
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const draftId = id ?? storedDraftId;

  const [code, setCode] = useState<string[]>(initialCode);
  const [revId, setRevId] = useState<number | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");
  const email = useSyncExternalStore(subscribeToDraft, getDraftEmail, () => "");

  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const sendMutation = useMutation({
    mutationFn: async (payload: { email: string; lang: "en" }) => {
      if (!draftId) {
        throw new Error(VERIFICATION_ERROR_CODE.DRAFT_IS_REQUIRED);
      }

      return SEND_OTP({
        draftId,
        payload,
      });
    },

    onSuccess: (data) => {
      setRevId(data.revId);
      setCode(initialCode());
      setResendCountdown(RESEND_COUNTDOWN_SECONDS);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (payload: T_VERIFY_EMAIL) => {
      if (!draftId) {
        throw new Error(VERIFICATION_ERROR_CODE.DRAFT_IS_REQUIRED);
      }

      return VERIFY_OTP({
        draftId,
        payload,
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (): Promise<T_COMPLETED_REGISTRATION> => {
      if (!draftId) {
        throw new Error(VERIFICATION_ERROR_CODE.DRAFT_IS_REQUIRED);
      }

      return COMPLETE_REGISTRATION_REQUEST({
        draftId,
      });
    },
    onSuccess: () => {
      clearPersisted([STORAGE_KEYS.draftId]);
    },
  });

  const sendCode = useCallback(async (): Promise<boolean> => {
    try {
      setError("");

      await sendMutation.mutateAsync({ email, lang: "en" });

      return true;
    } catch (error) {
      if (error instanceof Error) {
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
  }, [sendMutation, t]);

  const handleResend = useCallback(async (): Promise<boolean> => {
    if (resendCountdown > 0 || sendMutation.isPending) {
      return false;
    }

    return sendCode();
  }, [resendCountdown, sendMutation.isPending, sendCode]);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setError("");

      const result = verificationSchema.safeParse({
        otp: code.join(""),
      });

      if (!result.success) {
        throw result.error;
      }

      if (!revId) {
        throw new Error(VERIFICATION_ERROR_CODE.SEND_EMAIL_FAILED);
      }

      await verifyMutation.mutateAsync({
        otp: result.data.otp,
        revId,
      });

      await completeMutation.mutateAsync();

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
  }, [code, revId, verifyMutation, completeMutation, t]);

  return {
    draftId,
    email,

    code,
    setCode,

    sendCode,
    handleResend,
    handleSubmit,

    isResending: sendMutation.isPending,
    resendCountdown,

    isSubmitting: verifyMutation.isPending || completeMutation.isPending,

    completed: completeMutation.data,

    error,
  };
}

function isErrorCode(message: string): message is VERIFICATION_ERROR_CODE {
  return Object.values(VERIFICATION_ERROR_CODE).includes(
    message as VERIFICATION_ERROR_CODE,
  );
}
