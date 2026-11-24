import { createResourceSortMenu } from "@/shared/ui/resource-kit";
import { SORT_OPTIONS } from "../model/sort-options.config";
import { useCategorySortStore } from "../model/sort.store";

export const CategorySortMenu = createResourceSortMenu({
  useStore: useCategorySortStore,
  options: SORT_OPTIONS,
});
