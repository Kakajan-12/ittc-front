import { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";

import { API } from "@/shared/api";
import { OrganizationStepRequest, organizationStepSchema } from "./validation";
import { ORGANIZATION_STEP_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "@/views/Auth/config";

type OrganizationForm = OrganizationStepRequest;

const initialState: OrganizationForm = {
  organizationName: "",
  website: "",
  address: "",
  countryId: 0,
  city: "",
  postalCode: "",
};

type UseOrganizationStepFormProps = {
  t: _Translator<Record<string, any>, "Registration.organization">;
  id?: number;
};

export function useOrganizationStepForm({
  t,
  id,
}: UseOrganizationStepFormProps) {
  const [organizationForm, setOrganizationForm] =
    useState<OrganizationForm>(initialState);
  const [error, setError] = useState<string>("");
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );

  const draftId = id ?? storedDraftId;

  const resetForm = useCallback(() => {
    setOrganizationForm(initialState);
    setError("");
  }, []);

  const editMutation = useMutation({
    mutationFn: (data: OrganizationStepRequest) => {
      if (!draftId) {
        throw new Error("NO ID PROVIDED");
      }

      return API.ORGANIZATION_STEP.UPDATE(draftId, data);
    },

    onSuccess: async () => {
      // router.back();
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
