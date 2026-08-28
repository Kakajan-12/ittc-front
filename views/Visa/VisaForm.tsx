"use client";

import React, { useState } from "react";
import { Input } from "@/shared/ui/Input";
import { SelectField } from "@/shared/ui/SelectField";
import { DateField } from "@/shared/ui/DateField";
import SuccessModal from "@/views/Auth/SuccessModal";
import { SECTIONS } from "./visaData";
import { PhoneField } from "@/shared/ui/PhoneField";
import { UploadField } from "@/shared/ui/UploadField";
import { VISA_SCHEMA } from "./schema";
import { VISA_ERROR_CODE, VISA_ERROR_MESSAGE } from "./types";
import { useErrorText } from "@/shared/lib/errorText";

/** Where the application is sent */
const VISA_EMAIL = "visa@ittc-tm.com";

/** Flat field list in page order, with the section each field belongs to */
const FIELDS = SECTIONS.flatMap((section) =>
  (section.fields ?? []).map((field) => ({ ...field, section: section.title })),
);

/** Uploads live outside `values` — they hold `File`s, not strings */
const UPLOADS = SECTIONS.flatMap((section) => section.uploads ?? []);

/** Every field starts as an empty string — the schema works on strings */
const EMPTY_VALUES = Object.fromEntries(
  FIELDS.map((field) => [field.id, ""]),
) as Record<string, string>;

/** Selects submit codes (`TM`) — put the readable label in the email */
const labelFor = (fieldId: string, value: string) => {
  const options = FIELDS.find((f) => f.id === fieldId)?.options;
  const option = options?.find((o) =>
    typeof o === "string" ? o === value : o.value === value,
  );
  if (!option) return value;
  return typeof option === "string" ? option : option.label;
};

const buildMessage = (values: Record<string, string>) => {
  const lines: string[] = [];
  let currentSection = "";

  for (const field of FIELDS) {
    const value = (values[field.id] ?? "").trim();
    if (!value) continue;

    if (field.section !== currentSection) {
      currentSection = field.section;
      lines.push(`${lines.length ? "\n" : ""}${currentSection}`);
    }
    lines.push(`${field.label}: ${labelFor(field.id, value)}`);
  }

  return lines.join("\n");
};

export default function VisaForm() {
  // Сообщения телефона приходят ключом перевода — см. shared/lib/phone
  const errorText = useErrorText();
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const setFile = (id: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
    setErrors((prev) => (id in prev ? { ...prev, [id]: "" } : prev));
  };

  const setValue = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => (id in prev ? { ...prev, [id]: "" } : prev));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.name, e.target.value);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = VISA_SCHEMA.safeParse(values);

    /** Uploads are validated by hand — they never reach the string schema */
    const uploadErrors: Record<string, string> = {};
    for (const upload of UPLOADS) {
      if (!upload.optional && !files[upload.id]) {
        uploadErrors[upload.id] = "Upload a file";
      }
    }

    if (!result.success || Object.keys(uploadErrors).length) {
      const nextErrors: Record<string, string> = { ...uploadErrors };

      for (const issue of result.error?.issues ?? []) {
        const id = String(issue.path[0]);
        if (nextErrors[id]) continue;

        const code = issue.message as VISA_ERROR_CODE;
        nextErrors[id] = VISA_ERROR_MESSAGE[code] ?? issue.message;
      }

      setErrors(nextErrors);

      const first = [...UPLOADS, ...FIELDS].find(
        (field) => nextErrors[field.id],
      );
      if (first) {
        const el = document.getElementById(first.id);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      }
      return;
    }

    setErrors({});

    const data = result.data;
    const applicant = [data.firstName, data.surname]
      .filter(Boolean)
      .join(" ")
      .trim();

    const subject = `Visa application${applicant ? ` — ${applicant}` : ""}`;
    const body = buildMessage(values);

    // TODO: send to API — for now the application only goes to the console
    console.group("Visa application");
    console.log("subject:", subject);
    console.log("to:", VISA_EMAIL);
    console.table(data);
    console.log(
      "files:",
      Object.fromEntries(
        Object.entries(files).map(([id, file]) => [id, file?.name ?? null]),
      ),
    );
    console.log("message:\n" + body);
    console.groupEnd();

    setSent(true);
  };

  return (
    <div className="my-8 px-4 lg:px-10 flex flex-col-reverse lg:flex-row gap-6 lg:gap-10 items-start">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex-1 w-full flex flex-col gap-10"
      >
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-28 flex flex-col gap-6"
          >
            <h2 className="text-xl font-bold text-brand-dark-gray">
              {section.title}
            </h2>

            {section.uploads && (
              <div className="flex items-center gap-8">
                {section.uploads.map((upload) => (
                  <UploadField
                    key={upload.id}
                    id={upload.id}
                    name={upload.id}
                    title={upload.title}
                    aspect={upload.aspect}
                    width={upload.width}
                    sample={upload.sample}
                    accept={upload.accept}
                    required={!upload.optional}
                    value={files[upload.id] ?? null}
                    onValueChange={(file) => setFile(upload.id, file)}
                    error={errorText(errors[upload.id])}
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
              {section.fields?.map((field) =>
                field.options ? (
                  <SelectField
                    key={field.id}
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    placeholder={field.placeholder}
                    options={field.options}
                    required={!field.optional}
                    value={values[field.id] || null}
                    onValueChange={(value) => setValue(field.id, value ?? "")}
                    error={errorText(errors[field.id])}
                  />
                ) : field.type === "date" ? (
                  <DateField
                    key={field.id}
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    placeholder={field.placeholder}
                    notFuture={field.notFuture}
                    notPast={field.notPast}
                    minMonthsAhead={field.minMonthsAhead}
                    required={!field.optional}
                    value={values[field.id]}
                    onValueChange={(_, formValue) =>
                      setValue(field.id, formValue)
                    }
                    error={errorText(errors[field.id])}
                  />
                ) : field.type === "tel" ? (
                  <PhoneField
                    key={field.id}
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={values[field.id]}
                    onChange={(phone) => setValue(field.id, phone)}
                    required={!field.optional}
                    error={errorText(errors[field.id])}
                  />
                ) : (
                  <Input
                    key={field.id}
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    required={!field.optional}
                    value={values[field.id]}
                    onChange={handleChange}
                    error={errorText(errors[field.id])}
                  />
                ),
              )}
            </div>
          </section>
        ))}

        <div className="flex flex-col gap-3">
          {Object.values(errors).some(Boolean) && (
            <p role="alert" className="text-sm text-[#DE7A7A]">
              Please check the highlighted fields
            </p>
          )}

          <button
            type="submit"
            className="self-start rounded bg-brand-blue px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Submit application
          </button>
        </div>
      </form>

      <SuccessModal open={sent} onClose={() => setSent(false)} />
    </div>
  );
}
