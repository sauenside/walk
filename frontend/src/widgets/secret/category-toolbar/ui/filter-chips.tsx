import { useSecretCategoryList } from "@/entities/category";
import { CATEGORY_FILTER_SECTIONS, useCategoryFiltersStore } from "@/features/secret/category-filter";
import { useCategorySortStore } from "@/features/secret/category-sort";
import { createResourceFilterChips } from "@/shared/ui/resource-kit";

// Тот же запрос, что у таблицы: React Query не отправит его второй раз
const useTotal = () => {
  const filters = useCategoryFiltersStore.useValue();
  const sort = useCategorySortStore.useValue();
  return useSecretCategoryList({ filters, sort }).data?.pages[0]?.total;
};

export const FilterChips = createResourceFilterChips({
  useStore: useCategoryFiltersStore,
  sections: CATEGORY_FILTER_SECTIONS,
  useTotal,
});
