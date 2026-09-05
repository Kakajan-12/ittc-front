import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";

import { API } from "@/shared/api";
import { OrganizationStepRequest, organizationStepSchema } from "./validation";
import { ORGANIZATION_STEP_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { API_V2 } from "@/shared/api_v2";
import { saveDraft, useRegistrationDraft } from "@/views/Auth/draft";
import type { RegistrationDraft } from "@/views/Auth/types";

type OrganizationForm = OrganizationStepRequest;

const initialState: OrganizationForm = {
  organizationName: "",
  website: "",
  address: "",
  countryId: 0,
  city: "",
  postalCode: "",
};

/** Форму ещё не заполняли — можно подставить сохранённое в драфте */
function isPristine(form: OrganizationForm) {
  return (
    !form.organizationName &&
    !form.website &&
    !form.address &&
    !form.countryId &&
    !form.city &&
    !form.postalCode
  );
}

function fromDraft(draft: RegistrationDraft): OrganizationForm {
  return {
    organizationName: draft.organizationName ?? "",
    website: draft.website ?? "",
    address: draft.address ?? "",
    countryId: draft.countryId ?? 0,
    city: draft.city ?? "",
    postalCode: draft.postalCode ?? "",
  };
}

type UseOrganizationStepFormProps = {
  t: _Translator<Record<string, any>, "Registration.organization">;
  id?: number;
};

export function useOrganizationStepForm({
  t,
  id,
}: UseOrganizationStepFormProps) {
  // Через `sessionStorage`: значение переживает переход на другой шаг и смену
  // языка, поэтому при возврате назад поля остаются заполненными
  const [organizationForm, setOrganizationForm] =
    usePersistentState<OrganizationForm>(
      STORAGE_KEYS.draftCompany,
      initialState,
    );
  const [error, setError] = useState<string>("");
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const draftId = id ?? storedDraftId;

  const draft = useRegistrationDraft();

  const resetForm = useCallback(() => {
    setOrganizationForm(initialState);
    setError("");
  }, [setOrganizationForm]);

  // Введённое в этой сессии важнее сохранённого на бэке, поэтому из драфта
  // заполняем только нетронутую форму — например, после перезагрузки страницы
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    if (!draftId || draft?.id !== draftId) return;

    hydrated.current = true;

    setOrganizationForm((prev) => (isPristine(prev) ? fromDraft(draft) : prev));
  }, [draft, draftId, setOrganizationForm]);

  const editMutation = useMutation({
    mutationFn: (data: OrganizationStepRequest) => {
      if (!draftId) {
        throw new Error("NO ID PROVIDED");
      }

      return API_V2.ORGANIZATION_STEP.UPDATE(draftId, data);
    },

    onSuccess: async (response) => {
      saveDraft(response);
    },
  });

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setError("");

      const result = organizationStepSchema.safeParse(organizationForm);

      if (!result.success) {
        throw result.error;
      }
      const website = result.data.website;

      const payload: OrganizationStepRequest = {
        organizationName: result.data.organizationName,
        address: result.data.address,
        countryId: result.data.countryId,
        city: result.data.city,
        postalCode: result.data.postalCode,
        ...(website ? { website } : {}),
      };

      await editMutation.mutateAsync(payload);

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];

        setError(
          getErrorMessage({
            t,
            errorCode: firstError.message as ORGANIZATION_STEP_ERROR_CODE,
          }),
        );
      } else if (error instanceof Error) {
        // Ошибка бэкенда (например, 400 VALIDATION_ERROR) — иначе форма
        // молча ничего не делает.
        setError(error.message);
      }

      return false;
    }
  }, [organizationForm, editMutation, t]);

  const isSubmitting = editMutation.isPending;

  return {
    organizationForm,
    setOrganizationForm,
    resetForm,
    handleSubmit,
    isSubmitting,
    error,
  };
}
