"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel } from "./FieldLabel";
import "../../views/Visa/input.css";

export type SelectFieldOption = string | { value: string; label: string };

export type SelectFieldProps = {
  id: string;
  name?: string;
  label?: string;
  placeholder?: string;
  options: SelectFieldOption[];
  defaultValue?: string | null;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
};

export const SelectField = ({
  id,
  name,
  label,
  placeholder = " ",
  options,
  defaultValue = null,
  value,
  onValueChange,
  required,
  disabled,
  className = "",
  error,
}: SelectFieldProps) => {
  const items = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <div className="field field-raised flex flex-col gap-2">
      <Select
        id={id}
        name={name ?? id}
        items={items}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger
          aria-invalid={error ? true : undefined}
          className={`visa-input-style visa-select-trigger ${
            error ? "visa-input-error" : ""
          } ${className}`}
        >
          <SelectValue
            className="visa-select-value"
            placeholder={placeholder}
          />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          {items.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-black pl-5 font-bf"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
