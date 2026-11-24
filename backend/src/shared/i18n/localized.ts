import type { z } from "zod";
import { LOCALES, type Locale } from "./locale";

export const LOCALE_FIELD_SUFFIX = { kk: "Kk", ru: "Ru", en: "En" } as const satisfies Record<Locale, string>;

type LocaleFieldSuffix = (typeof LOCALE_FIELD_SUFFIX)[Locale];

export type LocalizedField<Base extends string> = `${Base}${LocaleFieldSuffix}`;

export const localizedField = <Base extends string>(base: Base, locale: Locale) =>
  `${base}${LOCALE_FIELD_SUFFIX[locale]}` as LocalizedField<Base>;

export const localizedFields = <Base extends string>(base: Base) =>
  LOCALES.map((locale) => localizedField(base, locale));

export const pickLocalized = <Base extends string, T extends Record<LocalizedField<Base>, unknown>>(
  record: T,
  base: Base,
  locale: Locale,
): T[LocalizedField<Base>] => record[localizedField(base, locale)];

// Поле на каждый язык: localizedShape("name", schema) → { nameKk, nameRu, nameEn }
export const localizedShape = <Base extends string, S extends z.ZodType>(base: Base, schema: S) =>
  Object.fromEntries(localizedFields(base).map((field) => [field, schema])) as Record<LocalizedField<Base>, S>;

// Значение на нужном языке; пустое — на первом заполненном. Для полей, обязательных не на всех языках
export const pickLocalizedOrAny = <Base extends string, T extends Record<LocalizedField<Base>, string>>(
  record: T,
  base: Base,
  locale: Locale,
) => [locale, ...LOCALES].map((other) => pickLocalized(record, base, other)).find((value) => value.trim()) ?? "";

// Ошибки полей для языков, на которых значение пустое: { nameEn: "required" }
export const missingLocalized = <Base extends string>(
  record: Partial<Record<LocalizedField<Base>, string | null>>,
  base: Base,
  locales: readonly Locale[],
) =>
  Object.fromEntries(
    locales
      .map((locale) => localizedField(base, locale))
      .filter((field) => !record[field]?.trim())
      .map((field) => [field, "required"]),
  );
