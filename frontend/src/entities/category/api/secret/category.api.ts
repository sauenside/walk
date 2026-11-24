import { http } from "@/shared/api/client";
import { createResourceApi, type ResourceApi } from "@/shared/api/factories";
import type { SortValue } from "@/shared/lib/store-factories";
import { visibilityToFlags, type VisibilityStatus } from "@/shared/lib/visibility";
import {
  categoryMetricsSchema,
  categoryPageSchema,
  categoryRootSchema,
  categorySchema,
  type Category,
  type CategoryInput,
  type CategoryMetrics,
  type CategoryPage,
  type CategoryRoot,
  type MediaType,
} from "../../model/schemas";

// tree — корневые порциями вместе с подкатегориями; flat — строки подряд при поиске и фильтрах
export type CategoryView = "tree" | "flat";

export type CategoryFilters = {
  search: string;
  status: "all" | VisibilityStatus;
  parentId: "all" | "root" | (string & {});
  mediaType: "all" | MediaType;
  // Фильтр по товарам скрыт до модуля товаров и в запрос не уходит
  products: "all" | "filled" | "empty";
};

export type CategorySortKey = "position" | "name" | "products" | "updatedAt" | "createdAt";

export type CategorySort = SortValue<CategorySortKey>;

export type CategoryListQuery = {
  filters: CategoryFilters;
  sort: CategorySort;
};

export type CategoryListParams = CategoryListQuery & {
  view: CategoryView;
  cursor: string | null;
  limit: number;
};

// Общий CRUD из фабрики + свои запросы категорий
export type SecretCategoryApi = ResourceApi<Category, CategoryPage, CategoryInput, CategoryListParams> & {
  metrics: () => Promise<CategoryMetrics>;
  roots: () => Promise<CategoryRoot[]>;
};

// Поиск или любой фильтр переключают таблицу из дерева в плоский список
export const resolveCategoryView = ({ search, ...filters }: CategoryFilters): CategoryView =>
  search.trim() || Object.values(filters).some((value) => value !== "all") ? "flat" : "tree";

const optional = <T extends string>(value: T) => (value === "all" ? undefined : value);

const PATH = "/secret/categories";

export const secretCategoryApi: SecretCategoryApi = {
  ...createResourceApi<Category, CategoryPage, CategoryInput, CategoryListParams>({
    path: PATH,
    itemSchema: categorySchema,
    pageSchema: categoryPageSchema,
    toSearchParams: ({ view, filters, sort, cursor, limit }) => ({
      view,
      search: filters.search.trim() || undefined,
      ...(filters.status === "all" ? {} : visibilityToFlags(filters.status)),
      parentId: optional(filters.parentId),
      mediaType: optional(filters.mediaType),
      sortBy: sort.key,
      sortOrder: sort.order,
      cursor: cursor ?? undefined,
      limit,
    }),
  }),
  metrics: async () => categoryMetricsSchema.parse((await http.get(`${PATH}/metrics`)).data),
  roots: async () => categoryRootSchema.array().parse((await http.get(`${PATH}/roots`)).data),
};
