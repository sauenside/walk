import { CategoryFilterMenu, CategorySearch } from "@/features/secret/category-filter";
import { CategorySortMenu } from "@/features/secret/category-sort";
import { ResourcePageToolbar } from "@/shared/ui/templates/resource-page";
import { FilterChips } from "./filter-chips";

export const CategoryToolbar = () => (
  <ResourcePageToolbar
    sort={<CategorySortMenu />}
    search={<CategorySearch />}
    filter={<CategoryFilterMenu />}
    chips={<FilterChips />}
  />
);
