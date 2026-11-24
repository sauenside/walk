import { env } from "@/shared/config/env";
import { FALLBACK_LOCALE, LOCALES } from "@/shared/config/langs";
import { clientSettingsSchema, type ClientSettings } from "../../model/settings.schema";

// Настройки читает сервер Next при заходе на витрину; ответ кэшируется на минуту
const REVALIDATE_SECONDS = 60;

// Бэкенд не ответил — витрина всё равно открывается: все языки, русский по умолчанию
const FALLBACK: ClientSettings = { enabledLocales: [...LOCALES], defaultLocale: FALLBACK_LOCALE };

export const getClientSettings = async (): Promise<ClientSettings> => {
  try {
    const response = await fetch(`${env.apiOrigin}/client/settings`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) return FALLBACK;
    const parsed = clientSettingsSchema.safeParse(await response.json());
    return parsed.success ? parsed.data : FALLBACK;
  } catch {
    return FALLBACK;
  }
};
