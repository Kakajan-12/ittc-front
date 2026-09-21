import { countryOptions } from "@/shared/data/countries";
import { Section } from "./types";

/**
 * Только структура формы: порядок, типы и правила. Всё, что видит человек —
 * заголовки разделов, подписи и подсказки полей, варианты выбора — берётся из
 * messages/*.json по этим самым id (см. VisaForm). Так подписи не могут
 * разъехаться с переводами и не остаются в коде на одном языке.
 */

export const SECTIONS: Section[] = [
  {
    id: "personal",
    uploads: [
      {
        id: "photo",
        aspect: "5 / 6",
        width: 248,
        sample: "/visa/photo-sample.jpg",
        accept: "image/*",
      },
      {
        id: "passportScan",
        aspect: "1.68 / 1",
        width: 480,
        sample: "/visa/passport-sample.jpg",
        accept: "image/*,.pdf",
      },
    ],
    fields: [
      { id: "firstName" },
      { id: "surname" },
      {
        id: "gender",
        options: ["Male", "Female"],
      },
      {
        id: "maritalStatus",
        options: ["Single", "Married", "Divorced", "Widowed", "Separated"],
      },
      {
        id: "birthDate",
        type: "date",
        notFuture: true,
      },
      {
        id: "surnameOfBirth",
        optional: true,
      },
    ],
  },
  {
    id: "contact",
    fields: [
      {
        id: "citizenship",
        options: countryOptions,
      },
      {
        id: "country",
        options: countryOptions,
      },
      {
        id: "placeOfBirth",
      },
      {
        id: "address",
      },
      { id: "email", type: "email" },
      {
        id: "phone",
        type: "tel",
      },
      {
        id: "residentialAddress",
      },
    ],
  },
  {
    id: "passport",
    fields: [
      {
        id: "passportType",
        options: ["Ordinary", "Military"],
      },
      {
        id: "passportNumber",
      },
      {
        id: "dateIssue",
        type: "date",
        notFuture: true,
      },
      {
        id: "expiry",
        type: "date",
        notPast: true,
        minMonthsAhead: 6,
      },
      {
        id: "placeOfIssue",
        options: countryOptions,
      },
    ],
  },
  {
    id: "work",
    fields: [
      {
        id: "education",
      },
      {
        id: "speciality",
      },
      {
        id: "placeOfEducation",
      },
      {
        id: "placeOfWork",
      },
      {
        id: "position",
      },
      {
        id: "experience",
      },
    ],
  },
];
