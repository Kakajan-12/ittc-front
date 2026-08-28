"use client";

import React from "react";
import { FieldLabel } from "./FieldLabel";
import "../../views/Visa/input.css";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  suffix?: React.ReactNode;
  error?: string;
};

export const Input = ({
  className = "",
  label,
  suffix,
  error,
  onChange,
  id,
  placeholder = " ",
  type = "text",
  required = true,
  ...props
}: InputProps) => (
  <div className="field flex flex-col gap-2">
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`visa-input-style ${error ? "visa-input-error" : ""} ${className}`}
      {...props}
    />
    {label && (
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
    )}
    {suffix}
    {error && (
      <p id={`${id}-error`} role="alert" className="visa-error-text">
        {error}
      </p>
    )}
  </div>
);
