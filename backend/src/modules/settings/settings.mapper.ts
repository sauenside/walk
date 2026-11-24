import type { Settings } from "@/shared/database";

// Витрине нужны только языки
export const toClientSettings = ({ enabledLocales, defaultLocale }: Settings) => ({ enabledLocales, defaultLocale });

export const toSecretSettings = ({ id: _id, ...settings }: Settings) => settings;
