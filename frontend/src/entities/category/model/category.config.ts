import type { ApiErrorMessages } from "@/shared/api/schemas";

type Forms = [one: string, few: string, many: string];

// Склонения для plural(): «1 категория», «2 категории», «5 категорий»
export const CATEGORY_NOUNS: { nominative: Forms; accusative: Forms } = {
  nominative: ["категория", "категории", "категорий"],
  accusative: ["категорию", "категории", "категорий"],
};

export const SUBCATEGORY_NOUNS: Forms = ["подкатегория", "подкатегории", "подкатегорий"];

// Столбец, фильтр и сортировка по товарам вернутся вместе с модулем товаров
export const CATEGORY_PRODUCTS_ENABLED = false;

export const CATEGORY_ERROR_MESSAGES: ApiErrorMessages = {
  CATEGORY_NOT_FOUND: "категория не найдена, возможно, её уже удалили",
  CATEGORY_SLUG_TAKEN: "такой адрес slug уже занят другой категорией",
  CATEGORY_DEPTH_EXCEEDED:
    "уровней только два: подкатегорию нельзя сделать родителем, а категорию с подкатегориями нельзя сделать подкатегорией",
  CATEGORY_HAS_CHILDREN: "нельзя удалить: в категории есть подкатегории, обновите список и проверьте выбор",
  PICTURE_NOT_FOUND: "картинка не найдена, загрузите её заново",
};
