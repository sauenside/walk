import { CATEGORY_PRODUCTS_ENABLED } from "@/entities/category";
import { formatNumber } from "@/shared/lib/formatters";
import {
  STANDARD_COLUMN_LAYOUT,
  createResourceColumnHelper,
  createStandardColumns,
  type ColumnLayout,
} from "@/shared/ui/resource-kit";
import { NameCell } from "../ui/name-cell";
import type { CategoryRow } from "./use-category-rows";

const column = createResourceColumnHelper<CategoryRow>();
const standard = createStandardColumns<CategoryRow>();

// Колонку выбора фабрика таблицы добавляет сама
export const CATEGORY_COLUMNS_TEMPLATE = CATEGORY_PRODUCTS_ENABLED
  ? "minmax(300px, 1fr) 160px 90px 85px 110px"
  : "minmax(300px, 1fr) 160px 85px 110px";

export const CATEGORY_TABLE_MIN_WIDTH = CATEGORY_PRODUCTS_ENABLED ? 820 : 730;

// Телефон: только название и статус — позиция, дата и товары скрыты, таблица помещается без прокрутки
export const CATEGORY_MOBILE_COLUMNS_TEMPLATE = "minmax(0px, 1fr) auto";

export const CATEGORY_MOBILE_MIN_WIDTH = 0;

export const CATEGORY_COLUMN_LAYOUT: Record<string, ColumnLayout> = {
  ...STANDARD_COLUMN_LAYOUT,
  name: { className: "category-cell-name" },
  products: { align: "end", desktopOnly: true },
};

const ALL_COLUMNS = [
  column.display({
    id: "name",
    header: "название",
    cell: ({ row }) => <NameCell row={row.original} />,
  }),
  standard.status(({ category, parent }) => ({ item: category, parent })),
  column.display({
    id: "products",
    header: "товары",
    cell: ({ row }) => formatNumber(row.original.category.productsCount ?? 0),
  }),
  standard.position(({ category }) => category.position),
  standard.date("updatedAt", ({ category }) => category.updatedAt),
];

export const CATEGORY_COLUMNS = CATEGORY_PRODUCTS_ENABLED
  ? ALL_COLUMNS
  : ALL_COLUMNS.filter((item) => item.id !== "products");
