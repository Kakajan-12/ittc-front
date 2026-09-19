import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ZodError } from "zod";
import { _Translator } from "next-intl";

import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "@/views/Auth/config";
import { RegistrationDraft } from "../../types";
import { EVENT_SERVICE_STEP_REQUEST } from "./api";
import { EventServices } from "./type";
import { eventServicesSchema } from "./validation";
import { EVENT_SERVICES_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";

/** Выбор пакетов: id пакета из справочника → строка payload'а */
type SelectedPackages = Record<string, EventServices["packages"][number]>;

const initialState: SelectedPackages = {};

type UseEventServicesProps = {
  t: _Translator<Record<string, any>, "Registration.errors">;
  id?: number;
};

export function useEventServices({ t, id }: UseEventServicesProps) {
  const [storedDraftId] = usePersistentState<number | null>(
    STORAGE_KEYS.draftId,
    null,
  );
  const draftId = id ?? storedDraftId;

  const [selectedPackages, setSelectedPackages] =
    useState<SelectedPackages>(initialState);

  const [error, setError] = useState<string>("");

  const resetForm = useCallback(() => {
    setSelectedPackages(initialState);
    setError("");
  }, []);

  const editMutation = useMutation({
    mutationFn: (payload: EventServices): Promise<RegistrationDraft> => {
      if (!draftId) {
        throw new Error("NO ID PROVIDED");
      }

      return EVENT_SERVICE_STEP_REQUEST({
        draftId: draftId,
        payload,
      });
    },
  });

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    try {
      setError("");

      const result = eventServicesSchema.safeParse({
        packages: Object.values(selectedPackages),
      });

      if (!result.success) {
        throw result.error;
      }

      const payload: EventServices = {
        packages: result.data.packages.map(({ eventPackageId, quantity }) => ({
          eventPackageId,
          quantity,
        })),
      };

      await editMutation.mutateAsync(payload);

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];

        setError(
          getErrorMessage({
            t,
            errorCode: firstError.message as EVENT_SERVICES_ERROR_CODE,
          }),
        );
      } else if (error instanceof Error) {
        setError(error.message);
      }

      return false;
    }
  }, [selectedPackages, editMutation, t]);

  const isSubmitting = editMutation.isPending;

  return {
    selectedPackages,
    setSelectedPackages,
    resetForm,
    handleSubmit,
    isSubmitting,
    error,
  };
}
