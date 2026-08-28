"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IntlTelInput from "@intl-tel-input/react";
import type { Iso2 } from "intl-tel-input";
import "intl-tel-input/styles";
import "./phone-input.css";
import { cn } from "@/lib/utils";
import { loadPhoneUtils } from "@/shared/lib/phone";

type PhoneInputProps = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  /** Full international number, e.g. `+99361234567` */
  value?: string;
  onChange: (phone: string) => void;
  defaultCountry?: Iso2;
  className?: string;
  required?: boolean;
  error?: string;
};

export default function PhoneInput({
  id = "phone",
  name = "phone",
  label,
  /** По умолчанию — подпись поля */
  placeholder,
  value = "",
  onChange,
  defaultCountry = "tm",
  className,
  required = true,
  error,
}: PhoneInputProps) {
  const t = useTranslations("Common");
  const [focused, setFocused] = useState(false);
  const hasNumber = value.trim().length > 0;
  const labelSuffix = required ? " *" : ` ${t("optional")}`;

  return (
    <div
      className={cn("auth-phone-wrap", className)}
      data-filled={hasNumber ? "" : undefined}
      data-focus={focused ? "" : undefined}
      data-error={error ? "" : undefined}
    >
      <div
        className="relative"
        data-raised={focused || hasNumber ? "" : undefined}
      >
        <IntlTelInput
          initialCountry={defaultCountry}
          value={value}
          onChangeNumber={onChange}
          loadUtils={loadPhoneUtils}
          showFlags={false}
          // OFF — иначе библиотека подменяет плейсхолдер образцом номера
          // выбранной страны, а в поле должна оставаться подпись
          placeholderNumberPolicy="OFF"
          classNames={{
            container: "auth-phone",
            input: "auth-phone-input",
            selectedCountry: "auth-phone-button",
            selectedFlag: "auth-phone-flag",
            countrySelector: "auth-phone-dropdown",
          }}
          inputProps={{
            id,
            name,
            required,
            placeholder: placeholder ?? label,
            autoComplete: "tel",
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${id}-error` : undefined,
          }}
        />
        <fieldset
          aria-hidden
          className={`field-outline ${
            hasNumber ? "field-outline--filled" : ""
          } ${error ? "field-outline--error" : ""}`}
        >
          {label ? (
            <legend className="field-legend">
              {label}
              {labelSuffix}
            </legend>
          ) : null}
        </fieldset>

        {label ? (
          <label htmlFor={id} className="field-label field-label--raised">
            {label}
            {labelSuffix}
          </label>
        ) : null}
      </div>

      {error ? (
        <p id={`${id}-error`} className="mt-1 font-nexa text-xs text-[#DE7A7A]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
