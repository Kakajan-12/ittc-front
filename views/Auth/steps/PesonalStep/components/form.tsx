"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useTranslations } from "next-intl";
import Field from "@/shared/ui/Field";
import PhoneInput from "@/shared/ui/PhoneInput";
import { usePersonalStepForm } from "../hook";
import { useRouter } from "next/navigation";
import { useErrorText } from "@/shared/lib/errorText";
import { useMutation } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";

interface PersonalStepProps {
  onShowTerms: () => void;
  // setCurrentStepIndex: Dispatch<SetStateAction<number>>;
}

export default function PersonalStepForm({
  onShowTerms,
  // setCurrentStepIndex,
}: PersonalStepProps) {
  const t = useTranslations("Registration.personal");
  const tErrors = useTranslations("Registration.errors");
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();
  const errorText = useErrorText();

  const {
    setPersonalForm,
    resetForm,
    // isLoading,
    personalForm,
    handleSubmit,
    isSubmitting,
    error,
  } = usePersonalStepForm({ t: tErrors });

  useEffect(() => {
    setPersonalForm((prev) => ({ ...prev, privacyPolicyAccepted: accepted }));
    setPersonalForm((prev) => ({
      ...prev,
      termsAndConditionsAccepted: accepted,
    }));
  }, [accepted]);

  return (
    <div className="flex min-h-0 h-full w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pt-2.5 pr-1">
        <Field
          id="name"
          label={t("name")}
          placeholder={t("namePlaceholder")}
          name="name"
          value={personalForm.firstName}
          onChange={(e) =>
            setPersonalForm((prev) => ({ ...prev, firstName: e.target.value }))
          }
          required
        />

        <Field
          id="lastName"
          label={t("surname")}
          name="surname"
          value={personalForm.lastName}
          onChange={(e) =>
            setPersonalForm((prev) => ({ ...prev, lastName: e.target.value }))
          }
          required
          placeholder={t("surnamePlaceholder")}
        />

        <Field
          id="patronymic"
          label={t("patronymic")}
          placeholder={t("patronymicPlaceholder")}
          name="patronymic"
          value={personalForm.patronymicName ?? ""}
          onChange={(e) =>
            setPersonalForm((prev) => ({
              ...prev,
              patronymicName: e.target.value,
            }))
          }
        />

        <Field
          id="position"
          label={t("position")}
          placeholder={t("positionPlaceholder")}
          name="position"
          value={personalForm.position}
          onChange={(e) =>
            setPersonalForm((prev) => ({ ...prev, position: e.target.value }))
          }
          required
        />

        <Field
          id="email"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
          name="email"
          value={personalForm.email}
          onChange={(e) =>
            setPersonalForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          type="email"
        />

        <PhoneInput
          label={t("phone")}
          placeholder={t("phonePlaceholder")}
          value={personalForm.phoneNumber}
          onChange={(value) =>
            setPersonalForm((prev) => ({
              ...prev,
              phoneNumber: value,
            }))
          }
        />

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm text-white">
          <input
            id="accept-terms"
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 size-4 accent-brand-blue rounded"
          />
          <span>
            {t.rich("terms", {
              terms: (chunks) => (
                <button
                  type="button"
                  onClick={onShowTerms}
                  className="text-brand-blue hover:underline capitalize"
                >
                  {chunks}
                </button>
              ),
              privacy: (chunks) => (
                <button
                  type="button"
                  onClick={onShowTerms}
                  className="text-brand-blue hover:underline capitalize"
                >
                  {chunks}
                </button>
              ),
            })}
          </span>
        </label>

        {error && (
          <p className="font-nexa text-sm text-[#DE7A7A]">{errorText(error)}</p>
        )}
      </div>

      <button
        disabled={isSubmitting}
        onClick={async () => {
          const ok = await handleSubmit();

          if (ok) {
            router.push("organization-info");
          }
        }}
        className="shrink-0 mt-5 h-12 rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("sending") : t("next")}
      </button>
    </div>
  );
}
