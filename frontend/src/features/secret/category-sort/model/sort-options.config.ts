import { CATEGORY_PRODUCTS_ENABLED, type CategorySortKey } from "@/entities/category";

const ALL_OPTIONS: { value: CategorySortKey; label: string }[] = [
  { value: "position", label: "позиция" },
  { value: "name", label: "название" },
  { value: "products", label: "количество товаров" },
  { value: "updatedAt", label: "дата изменения" },
  { value: "createdAt", label: "дата создания" },
];

export const SORT_OPTIONS = CATEGORY_PRODUCTS_ENABLED
  ? ALL_OPTIONS
  : ALL_OPTIONS.filter((option) => option.value !== "products");
