"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
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
import { submitVisaApplication } from "@/shared/content/submit";

/** Flat field list in page order, with the section each field belongs to */
const FIELDS = SECTIONS.flatMap((section) =>
  (section.fields ?? []).map((field) => ({ ...field, section: section.title })),
);

/**
 * The API rejects with the same codes the client validates against, so a
 * server-side failure can be shown under the field that caused it.
 */
const FIELD_BY_ERROR_CODE: Partial<Record<VISA_ERROR_CODE, string>> = {
  [VISA_ERROR_CODE.NAME_IS_TOO_SMALL]: "firstName",
  [VISA_ERROR_CODE.NAME_IS_TOO_BIG]: "firstName",
  [VISA_ERROR_CODE.SURNAME_IS_TOO_SMALL]: "surname",
  [VISA_ERROR_CODE.SURNAME_IS_TOO_BIG]: "surname",
  [VISA_ERROR_CODE.GENDER_IS_REQUIRED]: "gender",
  [VISA_ERROR_CODE.MARITAL_STATUS_IS_REQUIRED]: "maritalStatus",
  [VISA_ERROR_CODE.BIRTH_DATE_IS_REQUIRED]: "birthDate",
  [VISA_ERROR_CODE.BIRTH_DATE_IS_IN_FUTURE]: "birthDate",
  [VISA_ERROR_CODE.SURNAME_OF_BIRTH_IS_TOO_SMALL]: "surnameOfBirth",
  [VISA_ERROR_CODE.SURNAME_OF_BIRTH_IS_TOO_BIG]: "surnameOfBirth",
  [VISA_ERROR_CODE.CITIZENSHIP_IS_REQUIRED]: "citizenship",
  [VISA_ERROR_CODE.COUNTRY_IS_REQUIRED]: "country",
  [VISA_ERROR_CODE.PLACE_OF_BIRTH_IS_TOO_SMALL]: "placeOfBirth",
  [VISA_ERROR_CODE.ADDRESS_IS_TOO_SMALL]: "address",
  [VISA_ERROR_CODE.EMAIL_IS_INVALID]: "email",
  [VISA_ERROR_CODE.PHONE_IS_TOO_SMALL]: "phone",
  [VISA_ERROR_CODE.RESIDENTIAL_ADDRESS_IS_TOO_SMALL]: "residentialAddress",
  [VISA_ERROR_CODE.PASSPORT_TYPE_IS_REQUIRED]: "passportType",
  [VISA_ERROR_CODE.PASSPORT_NUMBER_IS_INVALID]: "passportNumber",
  [VISA_ERROR_CODE.DATE_ISSUE_IS_REQUIRED]: "dateIssue",
  [VISA_ERROR_CODE.DATE_ISSUE_IS_IN_FUTURE]: "dateIssue",
  [VISA_ERROR_CODE.EXPIRY_IS_REQUIRED]: "expiry",
  [VISA_ERROR_CODE.EXPIRY_IS_TOO_SOON]: "expiry",
  [VISA_ERROR_CODE.PLACE_OF_ISSUE_IS_REQUIRED]: "placeOfIssue",
  [VISA_ERROR_CODE.EDUCATION_IS_TOO_SMALL]: "education",
  [VISA_ERROR_CODE.SPECIALITY_IS_TOO_SMALL]: "speciality",
  [VISA_ERROR_CODE.PLACE_OF_EDUCATION_IS_TOO_SMALL]: "placeOfEducation",
  [VISA_ERROR_CODE.PLACE_OF_WORK_IS_TOO_SMALL]: "placeOfWork",
  [VISA_ERROR_CODE.POSITION_IS_TOO_SMALL]: "position",
  [VISA_ERROR_CODE.EXPERIENCE_IS_INVALID]: "experience",
};

/** Codes the API raises that the form has no field for. */
const GENERAL_ERROR_MESSAGE: Record<string, string> = {
  PHOTO_IS_REQUIRED: "Attach a photo",
  PASSPORT_SCAN_IS_REQUIRED: "Attach a passport scan",
  DUPLICATE_APPLICATION:
    "An application for this passport has already been submitted",
  DATABASE_UNAVAILABLE: "The service is temporarily unavailable, try again later",
};

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

/** Selects hold country codes; the officer reading the application wants names. */
const COUNTRY_FIELDS = new Set(["citizenship", "country", "placeOfIssue"]);

const toApiValues = (values: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(values).map(([id, value]) => [
      id,
      COUNTRY_FIELDS.has(id) ? labelFor(id, value) : value,
    ]),
  );

export default function VisaForm() {
  // Сообщения телефона приходят ключом перевода — см. shared/lib/phone
  const errorText = useErrorText();
  const locale = useLocale();
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    setFormError(null);

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
    setSubmitting(true);

    try {
      const application = await submitVisaApplication(
        toApiValues(values),
        files,
        locale,
      );

      setReference(application.reference);
      setSent(true);
    } catch (error) {
      const code = (error as Error).message;
      const fieldId = FIELD_BY_ERROR_CODE[code as VISA_ERROR_CODE];

      if (fieldId) {
        // The server disagreed about one field — point at it, as the client
        // validation would have.
        setErrors({ [fieldId]: VISA_ERROR_MESSAGE[code as VISA_ERROR_CODE] });

        const el = document.getElementById(fieldId);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      } else {
        setFormError(
          GENERAL_ERROR_MESSAGE[code] ??
            "Could not send the application. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
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

          {formError && (
            <p role="alert" className="text-sm text-[#DE7A7A]">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded bg-brand-blue px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Submit application"}
          </button>
        </div>
      </form>

      <SuccessModal
        open={sent}
        onClose={() => setSent(false)}
        details={reference ? `Reference: ${reference}` : undefined}
      />
    </div>
  );
}
