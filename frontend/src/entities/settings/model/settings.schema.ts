import { z } from "zod";
import { LOCALES } from "@/shared/config/langs";

const localeSchema = z.enum(LOCALES);

// Что нужно витрине: какие языки показывать и на каком открываться
export const clientSettingsSchema = z.object({
  enabledLocales: z.array(localeSchema).min(1),
  defaultLocale: localeSchema,
});

export const settingsSchema = clientSettingsSchema.extend({
  updatedAt: z.string(),
});

export type ClientSettings = z.infer<typeof clientSettingsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type SettingsInput = Partial<ClientSettings>;
