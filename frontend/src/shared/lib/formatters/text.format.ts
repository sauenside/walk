// Текстовые форматтеры: регистр и стиль записи, обрезка.
// Работают с любым алфавитом (кириллица, казахский), а не только с латиницей,
// и не ломают эмодзи: строка делится по символам, а не по половинкам суррогатных пар

export type TextCase =
  | "none"
  | "capitalize"
  | "sentence"
  | "uppercase"
  | "lowercase"
  | "title"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot";

// Первый символ и остаток; [...text] делит по символам, поэтому «😀abc» не разваливается
const splitFirst = (text: string): [first: string, rest: string] => {
  const [first = "", ...rest] = text;
  return [first, rest.join("")];
};

// «молоко» → «Молоко», «МОЛОКО» → «Молоко»
export const capitalizeWord = (word: string) => {
  const [first, rest] = splitFirst(word);
  return first.toLocaleUpperCase() + rest.toLocaleLowerCase();
};

// Слова из любой записи: «molochnyeProdukty», «MOLOCHNYE_PRODUKTY», «молочные-продукты» → два слова.
// \p{Lu}/\p{Ll} — заглавные и строчные любого алфавита, не только A–Z
export const toWords = (text: string) =>
  text
    .trim()
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1 $2")
    .split(/[\s_\-./]+/u)
    .filter(Boolean);

const joinWords = (text: string, join: string, word: (word: string, index: number) => string) =>
  toWords(text).map(word).join(join);

const lower = (word: string) => word.toLocaleLowerCase();
const upper = (word: string) => word.toLocaleUpperCase();

// Текст первым, стиль вторым — как у остальных форматтеров: formatNumber(value), plural(count, forms)
export const formatText = (text: string, style: TextCase): string => {
  switch (style) {
    // молочные и СЫРЫ → без изменений
    case "none":
      return text;

    // молочные и СЫРЫ → Молочные и СЫРЫ
    case "capitalize": {
      const [first, rest] = splitFirst(text);
      return first.toLocaleUpperCase() + rest;
    }

    // молочные и СЫРЫ → Молочные и сыры
    case "sentence":
      return capitalizeWord(text);

    // молочные и сыры → МОЛОЧНЫЕ И СЫРЫ
    case "uppercase":
      return upper(text);

    // МОЛОЧНЫЕ И СЫРЫ → молочные и сыры
    case "lowercase":
      return lower(text);

    // молочные и СЫРЫ → Молочные И Сыры
    case "title":
      return text.replace(/\S+/gu, capitalizeWord);

    // molochnye produkty → molochnyeProdukty
    case "camel":
      return joinWords(text, "", (word, index) => (index === 0 ? lower(word) : capitalizeWord(word)));

    // molochnye produkty → MolochnyeProdukty
    case "pascal":
      return joinWords(text, "", capitalizeWord);

    // molochnye produkty → molochnye_produkty
    case "snake":
      return joinWords(text, "_", lower);

    // molochnye produkty → molochnye-produkty (без транслитерации; адрес категории — slugify из shared/lib/slug)
    case "kebab":
      return joinWords(text, "-", lower);

    // molochnye produkty → MOLOCHNYE_PRODUKTY
    case "constant":
      return joinWords(text, "_", upper);

    // molochnye produkty → molochnye.produkty
    case "dot":
      return joinWords(text, ".", lower);
  }
};

// «Молочные продукты и сыры» с maxLength 15 → «Молочные проду…».
// Итог вместе с многоточием не длиннее maxLength
export const truncate = (text: string, maxLength: number, suffix = "…") => {
  const chars = [...text];
  if (chars.length <= maxLength) return text;
  const keep = Math.max(0, maxLength - [...suffix].length);
  return chars.slice(0, keep).join("").trimEnd() + suffix;
};
