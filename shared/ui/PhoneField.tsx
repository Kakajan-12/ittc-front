"use client";

import React from "react";
import IntlTelInput from "@intl-tel-input/react";
import type { Iso2 } from "intl-tel-input";
import "intl-tel-input/styles";
import { FieldLabel } from "./FieldLabel";
import "../../views/Visa/input.css";
import { loadPhoneUtils } from "@/shared/lib/phone";

export type PhoneFieldProps = {
  id: string;
  name?: string;
  label?: string;
  placeholder?: string;
  /** Full international number, e.g. `+99361234567` */
  value: string;
  onChange: (phone: string) => void;
  defaultCountry?: Iso2;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
};

export const PhoneField = ({
  id,
  name,
  label,
  placeholder = "Mobile number",
  value,
  onChange,
  defaultCountry = "tm",
  required,
  disabled,
  className = "",
  error,
}: PhoneFieldProps) => {
  const [focused, setFocused] = React.useState(false);

  // The widget reports "" until a digit is typed, so an untouched field is
  // empty even though the dial code is on screen.
  const hasNumber = value.trim().length > 0;

  return (
    <div
      className="field field-raised flex flex-col gap-2"
      data-filled={hasNumber ? "" : undefined}
      data-focus={focused ? "" : undefined}
    >
      <IntlTelInput
        initialCountry={defaultCountry}
        value={value}
        onChangeNumber={onChange}
        disabled={disabled}
        // Validation, as-you-type formatting and the strict-mode digit cap all
        // live in these rules — without them the widget never even reports a
        // number.
        loadUtils={loadPhoneUtils}
        // Show a sample number for the selected country, so the expected length
        // is visible before the user types anything.
        placeholderNumberPolicy="AGGRESSIVE"
        classNames={{
          container: `visa-input-style visa-phone ${
            error ? "visa-input-error" : ""
          } ${className}`,
          input: "visa-phone-input",
          selectedCountry: "visa-phone-button",
          countrySelector: "visa-phone-dropdown",
        }}
        inputProps={{
          id,
          name: name ?? id,
          required,
          placeholder,
          autoComplete: "tel",
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
        }}
      />

      {label && (
        <FieldLabel htmlFor={id} required={required}>
          {label}
        </FieldLabel>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="visa-error-text">
          {error}
        </p>
      )}
    </div>
  );
};
