import { cookies } from "next/headers";
import { LOCALE_COOKIE, isLocale, type Locale } from "@/shared/config/langs";

type LocaleSettings = { enabledLocales: readonly Locale[]; defaultLocale: Locale };

// Язык, который выбрал покупатель, если он ещё включён; иначе язык сайта по умолчанию
export const getLocale = async ({ enabledLocales, defaultLocale }: LocaleSettings): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) && enabledLocales.includes(value) ? value : defaultLocale;
};
