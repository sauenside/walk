// Языки каталога. Один список на всё: код языка (cookie, запрос витрины) и окончание полей API
export const LOCALES = ["ru", "kk", "en"] as const;

// Код языка: ru, kk, en
export type Locale = (typeof LOCALES)[number];

// Окончание полей API: nameRu, nameKk, nameEn — выводится из кода, а не пишется второй раз
export type Lang = Capitalize<Locale>;

export const toLang = (locale: Locale) => (locale.charAt(0).toUpperCase() + locale.slice(1)) as Lang;

export const LANGS: readonly Lang[] = LOCALES.map(toLang);

// Запасной язык витрины, если бэкенд не ответил; язык сайта по умолчанию задаётся в настройках
export const FALLBACK_LOCALE: Locale = "ru";

// Язык панели: с него открывается форма, на нём подписи записей; из русского названия собирается slug
export const SECRET_LANG: Lang = "Ru";

// Название языка на нём самом — одинаково в панели и на витрине
export const LANG_LABEL: Record<Lang, string> = {
  Ru: "русский",
  Kk: "қазақша",
  En: "english",
};

export const LOCALE_COOKIE = "locale";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);
