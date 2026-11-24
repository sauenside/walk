import { createResourceSearch } from "@/shared/ui/resource-kit";
import { useCategoryFiltersStore } from "../model/filters.store";

export const CategorySearch = createResourceSearch({
  useStore: useCategoryFiltersStore,
  id: "category-search",
  placeholder: "поиск по названию на любом языке",
});
