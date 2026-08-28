"use client";

import React from "react";
import dayjs, { type Dayjs } from "dayjs";
import { ConfigProvider, DatePicker } from "antd";
import { FieldLabel } from "./FieldLabel";
import "../../views/Visa/input.css";

export type DateFieldProps = {
  id: string;
  name?: string;
  label?: string;
  placeholder?: string;
  displayFormat?: string;
  defaultValue?: Date;
  /** Controlled value — a `Date` or an ISO `yyyy-MM-dd` string (`""` = empty) */
  value?: Date | string;
  /** `formValue` is the ISO `yyyy-MM-dd` string the form submits */
  onValueChange?: (date: Date | undefined, formValue: string) => void;
  /** Block dates after today (birth date, issue date) */
  notFuture?: boolean;
  /** Block dates before today (validity period, travel dates) */
  notPast?: boolean;
  /** Push the `notPast` bound forward, e.g. `6` — passport must stay valid
   *  for at least 6 more months */
  minMonthsAhead?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
};

/** Value sent with the form — ISO `yyyy-MM-dd`, same as a native date input */
const toFormValue = (date?: Dayjs | null) =>
  date ? date.format("YYYY-MM-DD") : "";

export const DateField = ({
  id,
  name,
  label,
  placeholder = "yyyy.mm.dd",
  displayFormat = "YYYY.MM.DD",
  defaultValue,
  value,
  onValueChange,
  notFuture,
  notPast,
  minMonthsAhead = 0,
  required,
  disabled,
  className = "",
  error,
}: DateFieldProps) => {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<Dayjs | null>(
    defaultValue ? dayjs(defaultValue) : null,
  );

  const controlled = value !== undefined;
  const selected = controlled ? (value ? dayjs(value) : null) : internal;

  const change = (date: Dayjs | null) => {
    if (!controlled) setInternal(date);
    onValueChange?.(date ? date.toDate() : undefined, toFormValue(date));
  };

  /** Earliest allowed day: today, pushed forward by `minMonthsAhead` */
  const earliest = dayjs().add(minMonthsAhead, "month");

  const disabledDate = (current: Dayjs) =>
    (!!notFuture && current.isAfter(dayjs(), "day")) ||
    (!!notPast && current.isBefore(earliest, "day"));

  return (
    <div
      className="field field-raised flex flex-col gap-2"
      data-filled={selected ? "" : undefined}
      data-focus={open ? "" : undefined}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#009fe3",
            fontFamily: "inherit",
            fontSize: 16,
            borderRadius: 4,
          },
        }}
      >
        <DatePicker
          id={id}
          value={selected}
          onChange={change}
          onOpenChange={setOpen}
          open={open}
          format={displayFormat}
          placeholder={placeholder}
          disabled={disabled}
          disabledDate={notFuture || notPast ? disabledDate : undefined}
          allowClear
          status={error ? "error" : undefined}
          className={`visa-input-style visa-date-picker ${
            error ? "visa-input-error" : ""
          } ${className}`}
          // popupClassName="visa-date-popup"
        />
      </ConfigProvider>

      <input
        type="hidden"
        name={name ?? id}
        value={toFormValue(selected)}
        required={required}
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
