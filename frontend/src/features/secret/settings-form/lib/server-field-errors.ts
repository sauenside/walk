import { createServerFieldErrors, sameFields } from "@/shared/lib/form";
import type { SettingsFormValues } from "../model/settings-form.schema";

// Ошибки полей из ответа API: { поле формы настроек: текст }
export const toServerFieldErrors = createServerFieldErrors<keyof SettingsFormValues>({
  fields: sameFields<keyof SettingsFormValues>(["enabledLocales", "defaultLocale"]),
  codeMessages: {
    SETTINGS_DEFAULT_LOCALE_DISABLED: { enabledLocales: "язык по умолчанию нельзя выключить" },
  },
});
