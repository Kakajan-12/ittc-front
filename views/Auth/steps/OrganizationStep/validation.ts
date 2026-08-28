import { z } from "zod";
import { ORGANIZATION_STEP_ERROR_CODE } from "./errorCodes";

export const organizationStepSchema = z.object({
  organizationName: z
    .string()
    .min(2, ORGANIZATION_STEP_ERROR_CODE.ORGANIZATION_NAME_IS_TOO_SMALL)
    .max(100, ORGANIZATION_STEP_ERROR_CODE.ORGANIZATION_NAME_IS_TOO_BIG),

  /**
   * Необязательное поле. Пустое значение приводится к "" (в payload не
   * попадает), введённое без схемы — к `https://…`, потому что бэкенд
   * принимает только полноценный URL.
   */
  website: z
    .string()
    .transform((value) => {
      const trimmed = value.trim();

      if (!trimmed) return "";

      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    })
    .refine(
      (value) => value === "" || z.url().safeParse(value).success,
      ORGANIZATION_STEP_ERROR_CODE.WEBSITE_IS_INVALID,
    )
    .nullable()
    .optional(),

  address: z
    .string()
    .min(2, ORGANIZATION_STEP_ERROR_CODE.ADDRESS_IS_TOO_SMALL)
    .max(255, ORGANIZATION_STEP_ERROR_CODE.ADDRESS_IS_TOO_BIG),

  countryId: z
    .number(ORGANIZATION_STEP_ERROR_CODE.COUNTRY_IS_REQUIRED)
    .min(1, ORGANIZATION_STEP_ERROR_CODE.COUNTRY_IS_REQUIRED),

  city: z
    .string()
    .min(2, ORGANIZATION_STEP_ERROR_CODE.CITY_IS_TOO_SMALL)
    .max(100, ORGANIZATION_STEP_ERROR_CODE.CITY_IS_TOO_BIG),

  postalCode: z
    .string()
    .min(2, ORGANIZATION_STEP_ERROR_CODE.POSTAL_CODE_IS_TOO_SMALL)
    .max(20, ORGANIZATION_STEP_ERROR_CODE.POSTAL_CODE_IS_TOO_BIG),
});

export type OrganizationStepRequest = z.infer<typeof organizationStepSchema>;
