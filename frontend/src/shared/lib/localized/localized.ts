import type { z } from "zod";
import { SECRET_LANG, LANGS, LANG_LABEL, type Lang } from "@/shared/config/langs";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "../formatters";

// Поле на каждый язык: name → nameRu, nameKk, nameEn
export type LocalizedKey<Base extends string> = `${Base}${Lang}`;

export const localizedKeys = <Base extends string>(base: Base) =>
  LANGS.map((lang) => `${base}${lang}` as LocalizedKey<Base>);

// Объект с полем на каждый язык: localizedFields("name", () => "") → { nameRu: "", nameKk: "", nameEn: "" }.
// Языки не перечисляются руками: новый язык в config/langs появится везде сам
export const localizedFields = <Base extends string, V>(base: Base, value: (key: LocalizedKey<Base>, lang: Lang) => V) =>
  Object.fromEntries(
    LANGS.map((lang) => {
      const key = `${base}${lang}` as LocalizedKey<Base>;
      return [key, value(key, lang)];
    }),
  ) as Record<LocalizedKey<Base>, V>;

// Схема zod на каждый язык: { ...localizedShape("name", schema) } → { nameRu, nameKk, nameEn }
export const localizedShape = <Base extends string, S extends z.ZodType>(base: Base, schema: S) =>
  localizedFields(base, () => schema);

// Маска для zod .pick(): { ...localizedMask("name") } → { nameRu: true, nameKk: true, nameEn: true }
export const localizedMask = <Base extends string>(base: Base) => localizedFields(base, () => true as const);

// Подпись поля на каждом языке: { nameRu: «название русский», nameKk: «название қазақша», … }
export const localizedLabels = <Base extends string>(base: Base, label: string) =>
  localizedFields(base, (_, lang) => `${label} ${LANG_LABEL[lang]}`);

type Named = Partial<Record<LocalizedKey<"name">, string | null>>;

// Название на нужном языке; если его нет — на первом заполненном. Регистр — TEXT_CASE.name
export const displayName = (record: Named, lang: Lang = SECRET_LANG) => {
  const name = [lang, ...LANGS].map((other) => record[`name${other}`]?.trim()).find(Boolean);
  return formatText(name ?? "без названия", TEXT_CASE.name);
};

// Языки, на которых поле не заполнено; langs — среди каких языков искать, например только включённых на сайте
export const missingLangs = <Base extends string>(
  values: Partial<Record<LocalizedKey<Base>, string | null>>,
  base: Base,
  langs: readonly Lang[] = LANGS,
) => langs.filter((lang) => !values[`${base}${lang}` as LocalizedKey<Base>]?.trim());
