"use client";

import React from "react";
import "../../views/Visa/input.css";

export type FieldLabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
  /** Required fields get a `*`, the rest are marked "(optional)" */
  required?: boolean;
};

/** The floating label shared by every visa field */
export const FieldLabel = ({
  htmlFor,
  children,
  required = true,
}: FieldLabelProps) => (
  <label htmlFor={htmlFor} className="visa-label-style">
    {children}
    {required ? (
      <span className="visa-label-required">*</span>
    ) : (
      <span className="visa-label-optional">(optional)</span>
    )}
  </label>
);
