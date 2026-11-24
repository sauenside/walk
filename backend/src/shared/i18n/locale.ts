import { z } from "zod";
import { createZodDto } from "../zod";

export const LOCALES = ["kk", "ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

// Без языка или с выключенным языком витрина отвечает на языке по умолчанию из настроек
export const localeQuerySchema = z.object({
  locale: z.enum(LOCALES).optional(),
});

export class LocaleQueryDto extends createZodDto(localeQuerySchema) {}
