import type { SettingsFormValues } from "./settings-form.schema";

// Вкладки настроек: новый раздел — новая строка здесь и своя вкладка в ui/tabs
export type SettingsTab = "languages";

export const SETTINGS_TABS: { value: SettingsTab; label: string }[] = [{ value: "languages", label: "языки" }];

// На какой вкладке поле: туда переключаемся, если сервер его отклонил
export const FIELD_TAB: Record<keyof SettingsFormValues, SettingsTab> = {
  enabledLocales: "languages",
  defaultLocale: "languages",
};

// Подписи полей в уведомлении об ошибках
export const FIELD_LABEL: Record<keyof SettingsFormValues, string> = {
  enabledLocales: "языки сайта",
  defaultLocale: "язык по умолчанию",
};
