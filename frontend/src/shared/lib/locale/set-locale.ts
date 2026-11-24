import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "@/shared/config/langs";

export const setLocale = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  window.location.reload();
};
