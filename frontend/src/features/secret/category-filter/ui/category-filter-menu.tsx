import { createResourceFilterMenu } from "@/shared/ui/resource-kit";
import { CATEGORY_FILTER_SECTIONS } from "../model/filter-sections.config";
import { useCategoryFiltersStore } from "../model/filters.store";

export const CategoryFilterMenu = createResourceFilterMenu({
  useStore: useCategoryFiltersStore,
  sections: CATEGORY_FILTER_SECTIONS,
});
