import { countryOptions } from "@/shared/data/countries";
import { Section } from "./types";

export const SECTIONS: Section[] = [
  {
    id: "personal",
    title: "Personal Information",
    uploads: [
      {
        id: "photo",
        title: "Upload files picture (5:6)",
        aspect: "5 / 6",
        width: 248,
        sample: "/visa/photo-sample.jpg",
        accept: "image/*",
      },
      {
        id: "passportScan",
        title: "Upload files",
        aspect: "1.68 / 1",
        width: 480,
        sample: "/visa/passport-sample.jpg",
        accept: "image/*,.pdf",
      },
    ],
    fields: [
      { id: "firstName", label: "Name", placeholder: "John" },
      { id: "surname", label: "Surname", placeholder: "Doe" },
      {
        id: "gender",
        label: "Gender",
        placeholder: "Select gender*",
        options: ["Male", "Female"],
      },
      {
        id: "maritalStatus",
        label: "Marital status",
        placeholder: "Select marital status*",
        options: ["Single", "Married", "Divorced", "Widowed", "Separated"],
      },
      {
        id: "birthDate",
        label: "Date of birth",
        type: "date",
        placeholder: "Date of birth*",
        notFuture: true,
      },
      {
        id: "surnameOfBirth",
        label: "Surname of birth",
        optional: true,
        placeholder: "Maiden name (if different)",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact & Address",
    fields: [
      {
        id: "citizenship",
        label: "Citizenship",
        placeholder: "Select country of citizenship*",
        options: countryOptions,
      },
      {
        id: "country",
        label: "Country of birth",
        placeholder: "Select country of birth*",
        options: countryOptions,
      },
      {
        id: "placeOfBirth",
        label: "Place of birth (City)",
        placeholder: "Enter city*",
      },
      {
        id: "address",
        label: "Personal address",
        placeholder: "Street, Building, Apt*",
      },
      { id: "email", label: "Email address", type: "email" },
      {
        id: "phone",
        label: "Phone number",
        type: "tel",
        placeholder: "Mobile number",
      },
      {
        id: "residentialAddress",
        label: "Planned residential address",
        placeholder: "Address during stay",
      },
    ],
  },
  {
    id: "passport",
    title: "Passport Info",
    fields: [
      {
        id: "passportType",
        label: "Passport type",
        placeholder: "Select passport type*",
        options: ["Ordinary", "Military"],
      },
      {
        id: "passportNumber",
        label: "Passport number",
        placeholder: "AB 123456",
      },
      {
        id: "dateIssue",
        label: "Passport date of issue",
        type: "date",
        placeholder: "Date of issue*",
        notFuture: true,
      },
      {
        id: "expiry",
        label: "Passport expiry",
        type: "date",
        placeholder: "Passport expiry*",
        notPast: true,
        minMonthsAhead: 6,
      },
      {
        id: "placeOfIssue",
        label: "Place of issue",
        placeholder: "Select country*",
        options: countryOptions,
      },
    ],
  },
  {
    id: "work",
    title: "Work & Education",
    fields: [
      {
        id: "education",
        label: "Education",
        placeholder: "Bachelor's Degree",
      },
      {
        id: "speciality",
        label: "Speciality",
        placeholder: "Computer Science",
      },
      {
        id: "placeOfEducation",
        label: "Place of education",
        placeholder: "Harvard University",
      },
      {
        id: "placeOfWork",
        label: "Place of work (Company name)",
        placeholder: "Tech Corp",
      },
      {
        id: "position",
        label: "Position",
        placeholder: "Software Engineer",
      },
      {
        id: "experience",
        label: "Experience",
        placeholder: "Years of experience",
      },
    ],
  },
];
