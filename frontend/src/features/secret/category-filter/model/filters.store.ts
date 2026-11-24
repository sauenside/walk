import type { CategoryFilters } from "@/entities/category";
import { createFiltersStore } from "@/shared/lib/store-factories";

export const useCategoryFiltersStore = createFiltersStore<CategoryFilters>({
  search: "",
  status: "all",
  parentId: "all",
  mediaType: "all",
  products: "all",
});
