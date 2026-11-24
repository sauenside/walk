import { z } from "zod";
import type { Settings, SettingsInput } from "@/entities/settings";
import { LOCALES } from "@/shared/config/langs";

export const SETTINGS_RULE_MESSAGES = {
  noLocales: "включите хотя бы один язык",
  defaultLocaleDisabled: "язык по умолчанию должен быть включён",
} as const;

export const settingsFormSchema = z
  .object({
    enabledLocales: z.array(z.enum(LOCALES)).min(1, SETTINGS_RULE_MESSAGES.noLocales),
    defaultLocale: z.enum(LOCALES),
  })
  .superRefine((values, ctx) => {
    if (!values.enabledLocales.includes(values.defaultLocale)) {
      ctx.addIssue({ code: "custom", path: ["defaultLocale"], message: SETTINGS_RULE_MESSAGES.defaultLocaleDisabled });
    }
  });

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// Языки — в порядке LOCALES, как бы их ни включали: сравнение «есть ли изменения» не зависит от порядка кликов
export const toFormValues = ({ enabledLocales, defaultLocale }: Settings): SettingsFormValues => ({
  enabledLocales: LOCALES.filter((locale) => enabledLocales.includes(locale)),
  defaultLocale,
});

export const toSettingsInput = (values: SettingsFormValues): SettingsInput => values;
