import { z } from "zod";
import { EVENT_SERVICES_ERROR_CODE } from "./errorCodes";

export const eventServicesSchema = z.object({
  packages: z
    .array(
      z.object({
        eventPackageId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, EVENT_SERVICES_ERROR_CODE.PACKAGE_IS_REQUIRED),
});
