import { AppError } from "@/shared/errors";

export const SettingsError = {
  defaultLocaleDisabled: () =>
    AppError.conflict("default locale must stay enabled", "SETTINGS_DEFAULT_LOCALE_DISABLED", {
      enabledLocales: "default locale must stay enabled",
    }),
};
