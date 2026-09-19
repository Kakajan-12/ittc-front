import { z } from "zod";
import { ORGANIZATION_STEP_ERROR_CODE } from "./errorCodes";

export const organizationStepSchema = z.object({
  organizationName: z
    .string()
    .min(2, ORGANIZATION_STEP_ERROR_CODE.ORGANIZATION_NAME_IS_TOO_SMALL)
    .max(100, ORGANIZATION_STEP_ERROR_CODE.ORGANIZATION_NAME_IS_TOO_BIG),
  website: z
    .string()
    .transform((value) => {
      const trimmed = value.trim();

      if (!trimmed) return "";

      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    })
    .refine((value) => {
      if (value === "") return true;

      try {
        const { hostname } = new URL(value);

        return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(hostname);
      } catch {
        return false;
      }
    }, ORGANIZATION_STEP_ERROR_CODE.WEBSITE_IS_INVALID)
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
