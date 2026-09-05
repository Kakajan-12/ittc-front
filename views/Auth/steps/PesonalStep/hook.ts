import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { _Translator } from "next-intl";
import { ZodError } from "zod";

import { PersonalStepRequest, personalStepSchema } from "./validation";
import { API } from "@/shared/api";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { API_V2 } from "@/shared/api_v2";
import { saveDraft, useRegistrationDraft } from "@/views/Auth/draft";
import type { RegistrationDraft } from "@/views/Auth/types";

type PersonalForm = Omit<
  PersonalStepRequest,
  "privacyPolicyAccepted" | "termsAndConditionsAccepted"
> & {
  privacyPolicyAccepted: boolean;
  termsAndConditionsAccepted: boolean;
};

const initialState: PersonalForm = {
  eventId: 4,
  firstName: "",
  lastName: "",
  patronymicName: "",
  email: "",
  phoneNumber: "",
  position: "",
  privacyPolicyAccepted: false,
  termsAndConditionsAccepted: false,
};

/** Форму ещё не заполняли — можно подставить сохранённое в драфте */
function isPristine(form: PersonalForm) {
  return (
    !form.firstName &&
    !form.lastName &&
    !form.patronymicName &&
    !form.email &&
    !form.phoneNumber &&
    !form.position
  );
}

function fromDraft(draft: RegistrationDraft): PersonalForm {
  return {
    eventId: draft.eventId ?? initialState.eventId,
    firstName: draft.firstName ?? "",
    lastName: draft.lastName ?? "",
    patronymicName: draft.patronymicName ?? "",
    email: draft.email ?? "",
    phoneNumber: draft.phoneNumber ?? "",
    position: draft.position ?? "",
    privacyPolicyAccepted: !!draft.privacyPolicyAccepted,
    termsAndConditionsAccepted: !!draft.termsAndConditionsAccepted,
  };
}

type UsePersonalStepFormProps = {
  t: _Translator<Record<string, any>, "Registration.personal">;
  id?: number;
};

export function usePersonalStepForm({ t, id }: UsePersonalStepFormProps) {
  const [personalForm, setPersonalForm] = usePersistentState<PersonalForm>(
    STORAGE_KEYS.personalStepForm,
    initialState,
  );

  const [error, setError] = useState<string>("");

  const [storedDraftId, setStoredDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const draftId = id ?? storedDraftId;

  const draft = useRegistrationDraft();

  const resetForm = useCallback(() => {
    setPersonalForm(initialState);
    setError("");
  }, [setPersonalForm]);

  // Возврат на шаг назад: поля заполняем из драфта. Введённое в этой сессии
  // важнее — оно уже лежит в `sessionStorage`, поэтому подставляем только в
  // нетронутую форму и только для того драфта, с которым идёт регистрация.
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    if (!draftId || draft?.id !== draftId) return;

    hydrated.current = true;

    setPersonalForm((prev) => (isPristine(prev) ? fromDraft(draft) : prev));
  }, [draft, draftId, setPersonalForm]);

  const createMutation = useMutation({
    mutationFn: async (data: PersonalStepRequest) =>
      await API_V2.PERSONAL_STEP.CREATE(data),

    onSuccess: async (response) => {
      setStoredDraftId(response.id);

      saveDraft(response);
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: PersonalStepRequest) => {
      if (!draftId) {
        throw new Error("NO ID PROVIDED");
      }

      return API_V2.PERSONAL_STEP.UPDATE(Number(draftId), data);
    },

    onSuccess: async (response) => {
      saveDraft(response);
    },
  });

  const handleSubmit = useCallback(async () => {
    setError("");

    try {
      const result = personalStepSchema.safeParse(personalForm);

      if (!result.success) {
        throw result.error;
      }

      const payload: PersonalStepRequest = {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        patronymicName: result.data.patronymicName,
        email: result.data.email,
        phoneNumber: result.data.phoneNumber,
        position: result.data.position,
        privacyPolicyAccepted: result.data.privacyPolicyAccepted,
        termsAndConditionsAccepted: result.data.termsAndConditionsAccepted,
        eventId: result.data.eventId,
        // expiredAt: new Date(),
      };

      if (draftId) {
        await editMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const code = error.issues[0].message;
        setError(
          t.has(code as PERSONAL_STEP_ERROR_CODE)
            ? getErrorMessage({
                t,
                errorCode: code as PERSONAL_STEP_ERROR_CODE,
              })
            : code,
        );
      } else {
        // Иначе ошибка запроса уходила в никуда: шаг молча не переключался.
        setError(error instanceof Error ? error.message : String(error));
      }

      return false;
    }
  }, [draftId, personalForm, editMutation, createMutation, t]);

  const isSubmitting = createMutation.isPending || editMutation.isPending;

  return {
    personalForm,
    setPersonalForm,
    resetForm,
    handleSubmit,
    isSubmitting,
    error,
  };
}
