import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";

import {
  clearPersisted,
  usePersistentState,
} from "@/shared/lib/usePersistentState";
import { OTP_LENGTH, STORAGE_KEYS } from "@/views/Auth/config";

import {
  // COMPLETE_REGISTRATION_REQUEST,
  RESEND_OTP,
  SEND_OTP,
  VERIFY_OTP,
} from "./api";

import { T_COMPLETED_REGISTRATION, T_SEND_OTP, T_VERIFY_EMAIL } from "./type";

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
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const draftId = id ?? storedDraftId;

  const [code, setCode] = useState<string[]>(initialCode);
  const [revId, setRevId] = usePersistentState<number | null>(
    STORAGE_KEYS.otpRevId,
    null,
  );
  const [nextResendAt, setNextResendAt] = useState<number | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");
  const email = useRegistrationDraft()?.email ?? "";

  useEffect(() => {
    if (!nextResendAt) return;

    const tick = () => {
      const seconds = Math.max(
        0,
        Math.ceil((nextResendAt - Date.now()) / 1000),
      );
      setResendCountdown(seconds);
      return seconds;
    };

    if (tick() === 0) return;

    const timer = setInterval(() => {
      if (tick() === 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextResendAt]);

  const applyOtpResponse = (data?: T_SEND_OTP) => {
    if (data?.revId) setRevId(data.revId);
    const next = data?.nextResendAt ? Date.parse(data.nextResendAt) : NaN;
    setNextResendAt(Number.isNaN(next) ? null : next);
    setCode(initialCode());
  };

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

    onSuccess: applyOtpResponse,
  });

  const resendMutation = useMutation({
    mutationFn: async (payload: { lang: "en" }) => {
      if (!revId) {
        throw new Error(VERIFICATION_ERROR_CODE.SEND_EMAIL_FAILED);
      }

      return RESEND_OTP({
        payload: { ...payload, revId },
      });
    },

    onSuccess: applyOtpResponse,
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

  // const completeMutation = useMutation({
  //   mutationFn: async (): Promise<T_COMPLETED_REGISTRATION> => {
  //     if (!draftId) {
  //       throw new Error(VERIFICATION_ERROR_CODE.DRAFT_IS_REQUIRED);
  //     }

  //     return COMPLETE_REGISTRATION_REQUEST({
  //       draftId,
  //     });
  //   },
  //   onSuccess: () => {
  //     clearPersisted([STORAGE_KEYS.draftId]);
  //   },
  // });

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
    if (
      resendCountdown > 0 ||
      sendMutation.isPending ||
      resendMutation.isPending
    ) {
      return false;
    }
    if (!revId) {
      return sendCode();
    }

    try {
      setError("");

      await resendMutation.mutateAsync({ lang: "en" });

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
  }, [
    resendCountdown,
    sendMutation.isPending,
    resendMutation,
    revId,
    sendCode,
    t,
  ]);

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

      // await completeMutation.mutateAsync();

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
  }, [code, revId, verifyMutation, t]);
  // completeMutation
  return {
    draftId,
    email,

    code,
    setCode,

    sendCode,
    handleResend,
    handleSubmit,

    isResending: sendMutation.isPending || resendMutation.isPending,
    resendCountdown,

    isSubmitting: verifyMutation.isPending,
    // || completeMutation.isPending,

    // completed: completeMutation.data,

    error,
  };
}

function isErrorCode(message: string): message is VERIFICATION_ERROR_CODE {
  return Object.values(VERIFICATION_ERROR_CODE).includes(
    message as VERIFICATION_ERROR_CODE,
  );
}
