// import { useCallback, useState } from "react";

// import { PersonalStepRequest, personalStepSchema } from "./validation";
// import { API } from "@/shared/api";
// import { useMutation } from "@tanstack/react-query";
// import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";
// import { ZodError } from "zod";
// import { getErrorMessage } from "./dictionary";
// import { _Translator } from "next-intl";
// import { usePersistentState } from "@/shared/lib/usePersistentState";
// import { STORAGE_KEYS } from "@/views/Auth/config";

// type PersonalForm = Omit<
//   PersonalStepRequest,
//   "privacyPolicyAccepted" | "termsAndConditionsAccepted"
// > & {
//   privacyPolicyAccepted: boolean;
//   termsAndConditionsAccepted: boolean;
// };

// const initialState: PersonalForm = {
//   eventId: 1,
//   firstName: "",
//   lastName: "",
//   patronymicName: "",
//   email: "",
//   phoneNumber: "",
//   position: "",
//   privacyPolicyAccepted: false,
//   termsAndConditionsAccepted: false,
// };

// type UsePersonalStepFormProps = {
//   t: _Translator<Record<string, any>, "Registration.personal">;
//   id?: number;
// };
// export function usePersonalStepForm({ t, id }: UsePersonalStepFormProps) {
//   const [personalForm, setPersonalForm] = useState<PersonalForm>(initialState);
//   const [error, setError] = useState<string>("");
//   const [storedDraftId, setStoredDraftId] = usePersistentState<number | null>(
//     STORAGE_KEYS.draftId,
//     null,
//   );

//   const draftId = id ?? storedDraftId;

//   // const { data, isLoading } = useQuery({
//   //   enabled: !!draftId,
//   //   queryKey: ["personalStep", draftId],
//   //   queryFn: () => API.PERSONAL_STEP.GET(Number(draftId)),
//   // });

//   const resetForm = useCallback(() => {
//     setPersonalForm(initialState);
//   }, []);

//   const createMutation = useMutation({
//     mutationFn: async (data: PersonalStepRequest) =>
//       await API.PERSONAL_STEP.CREATE(data),
//     onSuccess: async (response) => {
//       setStoredDraftId(response.id);
//       localStorage.setItem("eventDraft", JSON.stringify(response));
//       resetForm();
//       //   router.back();
//     },
//   });

//   const editMutation = useMutation({
//     mutationFn: (data: PersonalStepRequest) => {
//       if (!draftId) {
//         throw new Error("NO ID PROVIDED");
//       }

//       return API.PERSONAL_STEP.UPDATE(Number(draftId), data);
//     },

//     onSuccess: async (response) => {
//       localStorage.setItem("eventDraft", JSON.stringify(response));
//       //   router.back();
//     },
//   });

//   const handleSubmit = useCallback(async () => {
//     try {
//       const result = personalStepSchema.safeParse(personalForm);

//       if (!result.success) {
//         throw result.error;
//       }

//       const payload: PersonalStepRequest = {
//         firstName: result.data.firstName,
//         lastName: result.data.lastName,
//         patronymicName: result.data.patronymicName,
//         email: result.data.email,
//         phoneNumber: result.data.phoneNumber,
//         position: result.data.position,
//         privacyPolicyAccepted: result.data.privacyPolicyAccepted,
//         termsAndConditionsAccepted: result.data.termsAndConditionsAccepted,
//         eventId: result.data.eventId,
//       };

//       if (draftId) {
//         await editMutation.mutateAsync(payload);
//       } else {
//         await createMutation.mutateAsync(payload);
//       }
//       return true;
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const firstError = error.issues[0];

//         setError(
//           getErrorMessage({
//             t,
//             errorCode: firstError.message as PERSONAL_STEP_ERROR_CODE,
//           }),
//         );
//       }
//     }
//   }, [draftId, personalForm, editMutation, createMutation, t]);

//   const isSubmitting = createMutation.isPending || editMutation.isPending;

//   return {
//     personalForm,
//     setPersonalForm,
//     resetForm,
//     handleSubmit,
//     isSubmitting,
//     // isLoading,
//     error,
//   };
// }

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { _Translator } from "next-intl";
import { ZodError } from "zod";

import { PersonalStepRequest, personalStepSchema } from "./validation";
import { API } from "@/shared/api";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";
import { getErrorMessage } from "./dictionary";
import { usePersistentState } from "@/shared/lib/usePersistentState";
import { STORAGE_KEYS } from "@/views/Auth/config";

type PersonalForm = Omit<
  PersonalStepRequest,
  "privacyPolicyAccepted" | "termsAndConditionsAccepted"
> & {
  privacyPolicyAccepted: boolean;
  termsAndConditionsAccepted: boolean;
};

const initialState: PersonalForm = {
  eventId: 1,
  firstName: "",
  lastName: "",
  patronymicName: "",
  email: "",
  phoneNumber: "",
  position: "",
  privacyPolicyAccepted: false,
  termsAndConditionsAccepted: false,
};

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

  const resetForm = useCallback(() => {
    setPersonalForm(initialState);
    setError("");
  }, [setPersonalForm]);

  const createMutation = useMutation({
    mutationFn: async (data: PersonalStepRequest) =>
      await API.PERSONAL_STEP.CREATE(data),

    onSuccess: async (response) => {
      setStoredDraftId(response.id);

      localStorage.setItem("eventDraft", JSON.stringify(response));

      resetForm();
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: PersonalStepRequest) => {
      if (!draftId) {
        throw new Error("NO ID PROVIDED");
      }

      return API.PERSONAL_STEP.UPDATE(Number(draftId), data);
    },

    onSuccess: async (response) => {
      localStorage.setItem("eventDraft", JSON.stringify(response));
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
      };

      if (draftId) {
        await editMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }

      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.issues[0];

        setError(
          getErrorMessage({
            t,
            errorCode: firstError.message as PERSONAL_STEP_ERROR_CODE,
          }),
        );
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
