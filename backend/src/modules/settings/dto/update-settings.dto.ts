import { z } from "zod";
import { LOCALES } from "@/shared/i18n";
import { createZodDto, requireAnyField } from "@/shared/zod";

export const updateSettingsSchema = requireAnyField(
  z.strictObject({
    enabledLocales: z
      .array(z.enum(LOCALES))
      .min(1)
      .refine((locales) => new Set(locales).size === locales.length, { message: "locales must be unique" })
      .optional(),
    defaultLocale: z.enum(LOCALES).optional(),
  }),
);

export class UpdateSettingsDto extends createZodDto(updateSettingsSchema) {}
