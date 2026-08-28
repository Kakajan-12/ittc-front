"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  autoComplete?: string;
  suffix?: ReactNode;
  className?: string;
};

export default function Field({
  id,
  label,
  placeholder,
  type = "text",
  name,
  required = false,
  value,
  onChange,
  error,
  autoComplete,
  suffix,
  className,
}: FieldProps) {
  const t = useTranslations("Common");
  const labelSuffix = required ? " *" : ` ${t("optional")}`;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete ?? name}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`input-style field-input ${className ?? ""}`}
          // место под иконку справа — иначе текст уедет под неё
          style={suffix ? { paddingRight: 48 } : undefined}
        />

        {/* Рамку рисует fieldset: legend вырезает в ней настоящий разрыв под
            поднятую подпись. Сам текст легенды скрыт — она только распорка. */}
        <fieldset
          aria-hidden
          // --filled ставится независимо от ошибки: он поднимает подпись, а не
          // только красит рамку. Цвет ошибки перебивает его порядком в CSS.
          className={`field-outline ${value ? "field-outline--filled" : ""} ${
            error ? "field-outline--error" : ""
          }`}
        >
          <legend className="field-legend">
            {label}
            {labelSuffix}
          </legend>
        </fieldset>

        <label htmlFor={id} className="field-label">
          {label}
          {labelSuffix}
        </label>

        {/* Позиционируется абсолютно, поэтому порядок в разметке не ломает
            селекторы `~`, поднимающие подпись */}
        {suffix ? (
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            {suffix}
          </div>
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
