// import * as z from "zod";
// import { phoneErrorMessage } from "@/shared/lib/phone";
// import { isValidPostalCode } from "@/shared/lib/postalCode";
// // import { REGISTER_ERROR_CODE } from "./types";

// const text = (
//   tooSmall: REGISTER_ERROR_CODE,
//   tooBig: REGISTER_ERROR_CODE,
//   max = 50,
// ) => z.string().trim().min(2, tooSmall).max(max, tooBig);

// /** Optional text — validated only when the user typed something */
// const optionalText = (
//   tooSmall: REGISTER_ERROR_CODE,
//   tooBig: REGISTER_ERROR_CODE,
//   max = 50,
// ) =>
//   z
//     .string()
//     .trim()
//     .max(max, tooBig)
//     .refine((value) => value.length === 0 || value.length >= 2, tooSmall);

// export const PERSONAL_SCHEMA = z.object({
//   name: text(
//     REGISTER_ERROR_CODE.NAME_IS_TOO_SMALL,
//     REGISTER_ERROR_CODE.NAME_IS_TOO_BIG,
//   ),
//   surname: text(
//     REGISTER_ERROR_CODE.SURNAME_IS_TOO_SMALL,
//     REGISTER_ERROR_CODE.SURNAME_IS_TOO_BIG,
//   ),
//   patronymic: optionalText(
//     REGISTER_ERROR_CODE.PATRONYMIC_IS_TOO_SMALL,
//     REGISTER_ERROR_CODE.PATRONYMIC_IS_TOO_BIG,
//   ),
//   position: text(
//     REGISTER_ERROR_CODE.POSITION_IS_TOO_SMALL,
//     REGISTER_ERROR_CODE.POSITION_IS_TOO_BIG,
//   ),
//   email: z.email(REGISTER_ERROR_CODE.EMAIL_IS_INVALID),

//   phone: z
//     .string()
//     .trim()
//     .superRefine((value, ctx) => {
//       const message = phoneErrorMessage(value);
//       if (message) ctx.addIssue({ code: "custom", message });
//     }),
//   // В селекте лежит `id` типа участия из справочника бэкенда — на шаг 1
//   // уходит именно он, поэтому проверяем, что это положительное число
//   participatingType: z
//     .string()
//     .trim()
//     .refine(
//       (value) => /^\d+$/.test(value) && Number(value) > 0,
//       REGISTER_ERROR_CODE.PARTICIPATING_TYPE_IS_REQUIRED,
//     ),
//   accepted: z.literal(true, REGISTER_ERROR_CODE.TERMS_ARE_NOT_ACCEPTED),
// });

// export const COMPANY_SCHEMA = z
//   .object({
//     companyName: text(
//       REGISTER_ERROR_CODE.COMPANY_NAME_IS_TOO_SMALL,
//       REGISTER_ERROR_CODE.COMPANY_NAME_IS_TOO_BIG,
//       100,
//     ),
//     // Optional — accepts "example.com" as well as a full URL
//     companyWebsite: z
//       .string()
//       .trim()
//       .refine(
//         (value) =>
//           value.length === 0 ||
//           /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value),
//         REGISTER_ERROR_CODE.COMPANY_WEBSITE_IS_INVALID,
//       ),
//     companyAddress: text(
//       REGISTER_ERROR_CODE.COMPANY_ADDRESS_IS_TOO_SMALL,
//       REGISTER_ERROR_CODE.COMPANY_ADDRESS_IS_TOO_BIG,
//       100,
//     ),
//     // В селекте лежит `id` страны из справочника бэкенда — на бэкенд уходит он
//     companyCountry: z
//       .string()
//       .trim()
//       .refine(
//         (value) => /^\d+$/.test(value) && Number(value) > 0,
//         REGISTER_ERROR_CODE.COMPANY_COUNTRY_IS_REQUIRED,
//       ),
//     // ISO-2 той же страны — только для проверки индекса, на бэкенд не уходит
//     companyCountryCode: z.string().trim(),
//     companyCity: text(
//       REGISTER_ERROR_CODE.COMPANY_CITY_IS_TOO_SMALL,
//       REGISTER_ERROR_CODE.COMPANY_CITY_IS_TOO_BIG,
//     ),
//     // Формат зависит от страны — проверяется ниже, в superRefine
//     companyPostalCode: z.string().trim(),
//   })
//   .superRefine((values, ctx) => {
//     if (isValidPostalCode(values.companyPostalCode, values.companyCountryCode))
//       return;
//     ctx.addIssue({
//       code: "custom",
//       path: ["companyPostalCode"],
//       message: REGISTER_ERROR_CODE.COMPANY_POSTAL_CODE_IS_INVALID,
//     });
//   });
