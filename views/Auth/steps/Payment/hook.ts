import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";

import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { RegistrationDraft } from "../../types";
// import { PAYMENT_STEP_REQUEST } from "./api";
import { T_PAYMENT } from "./type";
import { paymentSchema } from "./validation";
import { PAYMENT_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import { PAYMENT_STEP_REQUEST } from "./api";
import { API_V2 } from "@/shared/api_v2";

type UsePaymentProps = {
  t: _Translator<Record<string, any>, "Registration.errors">;
  id?: number;
  draft?: RegistrationDraft;
};

export function usePayment({ t, id, draft }: UsePaymentProps) {
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );
  const draftId = id ?? draft?.id ?? storedDraftId;

  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);

  const [error, setError] = useState<string>("");

  const resetForm = useCallback(() => {
    setPaymentMethodId(null);
    setError("");
  }, []);

  const editMutation = useMutation({
    mutationFn: (payload: T_PAYMENT): Promise<RegistrationDraft> => {
      if (!draftId) {
        throw new Error("NO ID PROVIDED");
      }

      return PAYMENT_STEP_REQUEST({
        draftId: draftId,
        payload,
      });
    },
    onSuccess: (updated) => {
      localStorage.setItem("eventDraft", JSON.stringify(updated));
    },
  });

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setError("");

      const result = paymentSchema.safeParse({
        paymentMethodId,
        promocodeId: draft?.promocodeId ?? null,
        promocodeCode: draft?.promocodeCode ?? null,
        subtotalUsd: draft?.subtotalUsd ?? 0,
        subtotalTmt: draft?.subtotalTmt ?? 0,
        discountAmountUsd: draft?.discountAmountUsd ?? 0,
        discountAmountTmt: draft?.discountAmountTmt ?? 0,
        totalAmountUsd: draft?.totalAmountUsd ?? 0,
        totalAmountTmt: draft?.totalAmountTmt ?? 0,
      });

      if (!result.success) {
        throw result.error;
      }

      const payload: T_PAYMENT = {
        paymentMethodId: result.data.paymentMethodId,
        promocodeId: result.data.promocodeId,
        promocodeCode: result.data.promocodeCode,
        subtotalUsd: result.data.subtotalUsd,
        subtotalTmt: result.data.subtotalTmt,
        discountAmountUsd: result.data.discountAmountUsd,
        discountAmountTmt: result.data.discountAmountTmt,
        totalAmountUsd: result.data.totalAmountUsd,
        totalAmountTmt: result.data.totalAmountTmt,
      };

      await editMutation.mutateAsync(payload);

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];

        setError(
          getErrorMessage({
            t,
            errorCode: firstError.message as PAYMENT_ERROR_CODE,
          }),
        );
      } else if (error instanceof Error) {
        setError(error.message);
      }

      return false;
    }
  }, [paymentMethodId, editMutation, draft, t]);

  const isSubmitting = editMutation.isPending;

  return {
    paymentMethodId,
    setPaymentMethodId,
    resetForm,
    handleSubmit,
    isSubmitting,
    error,
  };
}
