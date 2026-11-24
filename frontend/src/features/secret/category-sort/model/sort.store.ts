import type { CategorySortKey } from "@/entities/category";
import { createSortStore } from "@/shared/lib/store-factories";

export const useCategorySortStore = createSortStore<CategorySortKey>({ key: "position", order: "asc" });
