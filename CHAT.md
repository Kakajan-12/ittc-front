you are next.js seniour developer

# FOLDER_NAME:OrganizationStep

# TYPE_NAME: OrganizationStepRequest

# API RESOUCE : resource: 'registration-drafts',

# API METHOD : PATCH

# create folowing files:

type.ts
errorCodes.ts
hook.ts
validation.ts
api.ts
dictionary.ts
components/form.tsx

# rules

1. create files one by one and return ready versions so i can copy and paste
2. use provided examples of each file that need to be created and try to use similar logic
3. dont skip and modify ready nodes if they exist
4. less words, more code
5. remind me to add api object name into:

   import { LOCATIONS } from '@/features/admin/locations/api';
   import { ORGINIZERS } from '@/features/admin/orginizers/api';
   import { PACKAGE_FEATURES } from '@/features/admin/package-features/api';
   .....

export const API = {
....
REGISTER_REQUESTS,
EVENT_PACKAGES,
FEES,
COUNTRIES,
PROMOCODES,
LOCATIONS,
EVENTS,
};

# type

```ts
export type TYPE_NAME = {
  organizationName: string;
  website?: string | null;
  address: string;
  countryId: number;
  city: string;
  postalCode: string;
};
```

# backend schema (skip this)

# examples of similar files

# validation.ts ---------------------------------------------------------------------->

import { z } from "zod";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";

export const personalStepSchema = z.object({
eventId: z.number(),
firstName: z
.string()
.min(2, PERSONAL_STEP_ERROR_CODE.NAME_IS_TOO_SMALL)
.max(50, PERSONAL_STEP_ERROR_CODE.NAME_IS_TOO_BIG),
lastName: z
.string()
.min(2, PERSONAL_STEP_ERROR_CODE.SURNAME_IS_TOO_SMALL)
.max(50, PERSONAL_STEP_ERROR_CODE.SURNAME_IS_TOO_BIG),
patronymicName: z.string().nullable().optional(),
email: z.email(PERSONAL_STEP_ERROR_CODE.EMAIL_IS_INVALID),
phoneNumber: z
.string()
.min(2, PERSONAL_STEP_ERROR_CODE.PHONE_NUMBER_IS_INVALID),
position: z
.string()
.min(2, PERSONAL_STEP_ERROR_CODE.POSITION_IS_TOO_SMALL)
.max(50, PERSONAL_STEP_ERROR_CODE.POSITION_IS_TOO_BIG),
privacyPolicyAccepted: z.literal(
true,
PERSONAL_STEP_ERROR_CODE.TERMS_ARE_NOT_ACCEPTED,
),
termsAndConditionsAccepted: z.literal(
true,
PERSONAL_STEP_ERROR_CODE.PRIVACY_POLICY_NOT_ACCEPTED,
),
});

export type PersonalStepRequest = z.infer<typeof personalStepSchema>;

# hook.ts ---------------------------------------------------------------------->

import { useCallback, useState } from "react";

import { PersonalStepRequest, personalStepSchema } from "./validation";
import { API } from "@/shared/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";
import { ZodError } from "zod";
import { getErrorMessage } from "./dictionary";
import { \_Translator } from "next-intl";

type PersonalForm = Omit<
PersonalStepRequest,
"privacyPolicyAccepted" | "termsAndConditionsAccepted"

> & {
> privacyPolicyAccepted: boolean;
> termsAndConditionsAccepted: boolean;
> };

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
t: \_Translator<Record<string, any>, "Registration.personal">;
id?: number;
};
export function usePersonalStepForm({ t, id }: UsePersonalStepFormProps) {
const [personalForm, setPersonalForm] = useState<PersonalForm>(initialState);
const [error, setError] = useState<string>("");
const { data, isLoading } = useQuery({
enabled: !!id,
queryKey: ["personalStep", id],
queryFn: () => API.PERSONAL_STEP.GET(Number(id)),
});

const resetForm = useCallback(() => {
setPersonalForm(initialState);
}, []);

const createMutation = useMutation({
mutationFn: async (data: PersonalStepRequest) =>
await API.PERSONAL_STEP.CREATE(data),
onSuccess: async (response) => {
const draftId = response.id; // нужно положить в сешн сторэдж
resetForm();
// router.back();
},
});

const editMutation = useMutation({
mutationFn: (data: PersonalStepRequest) => {
if (!id) {
throw new Error("NO ID PROVIDED");
}

      return API.PERSONAL_STEP.UPDATE(Number(id), data);
    },

    onSuccess: async () => {
      //   router.back();
    },

});

const handleSubmit = useCallback(async () => {
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

      console.log(payload);
      if (id) {
        await editMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
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
    }

}, [id, personalForm, editMutation, createMutation]);

const isSubmitting = createMutation.isPending || editMutation.isPending;

return {
personalForm,
setPersonalForm,
resetForm,
handleSubmit,
isSubmitting,
isLoading,
error,
};
}

# errorCodes.ts ---------------------------------------------------------------------->

export enum PERSONAL_STEP_ERROR_CODE {
NAME_IS_TOO_SMALL = "NAME_IS_TOO_SMALL",
NAME_IS_TOO_BIG = "NAME_IS_TOO_BIG",
SURNAME_IS_TOO_SMALL = "SURNAME_IS_TOO_SMALL",
SURNAME_IS_TOO_BIG = "SURNAME_IS_TOO_BIG",
PATRONYMIC_IS_TOO_SMALL = "PATRONYMIC_IS_TOO_SMALL",
PATRONYMIC_IS_TOO_BIG = "PATRONYMIC_IS_TOO_BIG",
EMAIL_IS_INVALID = "EMAIL_IS_INVALID",
PHONE_NUMBER_IS_INVALID = "PHONE_NUMBER_IS_INVALID",
POSITION_IS_TOO_SMALL = "POSITION_IS_TOO_SMALL",
POSITION_IS_TOO_BIG = "POSITION_IS_TOO_BIG",
TERMS_ARE_NOT_ACCEPTED = "TERMS_ARE_NOT_ACCEPTED",
PRIVACY_POLICY_NOT_ACCEPTED = "PRIVACY_POLICY_NOT_ACCEPTED",
}

# form.ts ---------------------------------------------------------------------->

use this as example to modify my current form file

"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Field from "@/shared/ui/Field";
import PhoneInput from "@/shared/ui/PhoneInput";
import { usePersonalStepForm } from "../hook";

interface PersonalStepProps {
onShowTerms: () => void;
}

export default function PersonalStepForm({ onShowTerms }: PersonalStepProps) {
const t = useTranslations("Registration.personal");
const tErrors = useTranslations("Registration.errors");
const [accepted, setAccepted] = useState(false);

const {
setPersonalForm,
resetForm,
isLoading,
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

<div className="flex min-h-0 w-full flex-1 flex-col">
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

        {error && <p className="font-nexa text-sm text-[#DE7A7A]">{error}</p>}
      </div>

      <button
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="shrink-0 mt-5 h-12 rounded bg-[#0071BB] font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t("sending") : t("next")}
      </button>
    </div>

);
}

here is mine current form
"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Field from "@/shared/ui/Field";
import Select from "@/shared/ui/Select";
import { useCountries } from "@/shared/api_old/hooks/useCountries";
import { countryTitle } from "@/shared/api_old/countries";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import { useErrorText } from "@/shared/lib/errorText";
import type { RegistrationFormData } from "../config";

interface CompanyStepProps {
formData: RegistrationFormData;
errors: Record<string, string>;
onChange: (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;
onCountryChange: (id: string, code: string) => void;
onSubmit: () => void;
isPending: boolean;
errorMessage?: string;
}

export default function CompanyStep({
formData,
errors,
onChange,
onCountryChange,
onSubmit,
isPending,
errorMessage,
}: CompanyStepProps) {
const t = useTranslations("Registration.company");
const tCommon = useTranslations("Common");
const locale = useLocale();
const errorText = useErrorText();

/\*_ Что набрали в строке поиска; в запрос уходит с задержкой _/
const [countryQuery, setCountryQuery] = useState("");
const debouncedQuery = useDebouncedValue(countryQuery, 300);

/** Пустая строка — весь справочник, иначе результат поиска на бэкенде \*/
const countries = useCountries(debouncedQuery);
/** Весь список отдельно: из него берётся подпись уже выбранной страны \*/
const allCountries = useCountries();

/\*_ Порядок из справочника — английский; сортируем по названию локали _/
const countryOptions = useMemo(
() =>
(countries.data ?? [])
.map((country) => ({
value: String(country.id),
label: countryTitle(country, locale),
code: country.code,
}))
.sort((a, b) => a.label.localeCompare(b.label, locale)),
[countries.data, locale],
);

/\*_ Найденного в текущей выдаче может не быть — подпись ищем во всём списке _/
const selectedLabel = useMemo(() => {
const selected = (allCountries.data ?? []).find(
(country) => String(country.id) === formData.companyCountry,
);
return selected ? countryTitle(selected, locale) : undefined;
}, [allCountries.data, formData.companyCountry, locale]);

return (

<form
noValidate
className="flex min-h-0 w-full flex-1 flex-col"
onSubmit={(e) => {
e.preventDefault();
onSubmit();
}} >
{/_ pt-2.5 — поднятая подпись первого поля выходит за его рамку вверх,
без отступа её срезал бы overflow скролла _/}
<div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pt-2.5 pr-1">
<Field
id="company-name"
label={t("companyName")}
placeholder={t("companyNamePlaceholder")}
name="companyName"
value={formData.companyName}
onChange={onChange}
required
error={errorText(errors.companyName)}
/>
<Field
id="company-website"
label={t("companyWebsite")}
placeholder={t("companyWebsitePlaceholder")}
name="companyWebsite"
value={formData.companyWebsite}
onChange={onChange}
error={errorText(errors.companyWebsite)}
/>
<Field
id="company-address"
label={t("companyAddress")}
placeholder={t("companyAddressPlaceholder")}
name="companyAddress"
value={formData.companyAddress}
onChange={onChange}
required
error={errorText(errors.companyAddress)}
/>

        <Select
          id="company-country"
          label={t("companyCountry")}
          placeholder={
            countries.isPending
              ? tCommon("loading")
              : t("companyCountryPlaceholder")
          }
          options={countryOptions}
          value={formData.companyCountry}
          onChange={(value) =>
            onCountryChange(
              value,
              countryOptions.find((option) => option.value === value)?.code ??
                "",
            )
          }
          searchable
          onSearchChange={setCountryQuery}
          searchPending={countries.isFetching}
          selectedLabel={selectedLabel}
          required
          error={errorText(
            errors.companyCountry ||
              (countries.isError ? countries.error.message : undefined),
          )}
        />
        <Field
          id="city"
          label={t("city")}
          placeholder={t("cityPlaceholder")}
          name="companyCity"
          value={formData.companyCity}
          onChange={onChange}
          required
          error={errorText(errors.companyCity)}
        />
        <Field
          id="postal-code"
          label={t("postalCode")}
          placeholder={t("postalCodePlaceholder")}
          name="companyPostalCode"
          value={formData.companyPostalCode}
          onChange={onChange}
          required
          error={errorText(errors.companyPostalCode)}
        />
      </div>

      {errorMessage && (
        <p className="mt-3 shrink-0 font-nexa text-sm text-[#DE7A7A]">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 mt-5 h-12 rounded bg-[#0071BB] text-base font-nexa-bold font-bold text-white transition-colors hover:bg-[#0071BB]/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? t("sending") : t("next")}
      </button>
    </form>

);
}

# api.ts ---------------------------------------------------------------------->

import { createCrudApi } from "@/shared/api/crud";
import { PersonalStepRequest } from "./type";
import { T_ENTITY } from "@/shared/api/types";

export const PERSONAL_STEP = createCrudApi<PersonalStepRequest & T_ENTITY>({
resource: "registration-drafts",
searchFields: [],
orderByFields: [],
filterFields: [],
});

leave as empty array
searchFields: [],
orderByFields: [],
filterFields: []

# dictionary.ts ---------------------------------------------------------------------->

import { \_Translator } from "next-intl";
import { PERSONAL_STEP_ERROR_CODE } from "./errorCodes";

export function getErrorMessage({
t,
errorCode,
}: {
t: \_Translator<Record<string, any>, "Registration.personal">;
errorCode: PERSONAL_STEP_ERROR_CODE;
}) {
return t(errorCode);
}
