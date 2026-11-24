import { CATEGORY_PRODUCTS_ENABLED, useSecretCategoryRoots, type CategoryFilters } from "@/entities/category";
import { displayName } from "@/shared/lib/localized";
import {
  staticOptions,
  visibilityFilterOptions,
  type FilterOption,
  type FilterSectionConfig,
} from "@/shared/ui/resource-kit";

const useParentOptions = (): FilterOption<CategoryFilters["parentId"]>[] => {
  const { data: roots = [] } = useSecretCategoryRoots();
  return [
    { value: "all", label: "все уровни" },
    { value: "root", label: "только корневые" },
    ...roots.map((root) => ({ value: root.id, label: displayName(root), icon: root.emoji ?? "" })),
  ];
};

// Одно описание и для меню фильтров, и для чипов над таблицей
const ALL_SECTIONS: FilterSectionConfig<CategoryFilters>[] = [
  { key: "status", title: "статус", useOptions: visibilityFilterOptions },
  { key: "parentId", title: "родитель", useOptions: useParentOptions, scrollAfter: 2 },
  {
    key: "mediaType",
    title: "оформление",
    useOptions: staticOptions<CategoryFilters["mediaType"]>([
      { value: "all", label: "любое" },
      { value: "EMOJI", label: "эмодзи" },
      { value: "PICTURE", label: "картинка" },
      { value: "NONE", label: "без оформления" },
    ]),
  },
  {
    key: "products",
    title: "товары",
    useOptions: staticOptions<CategoryFilters["products"]>([
      { value: "all", label: "все" },
      { value: "filled", label: "с товарами" },
      { value: "empty", label: "без товаров" },
    ]),
  },
];

export const CATEGORY_FILTER_SECTIONS = CATEGORY_PRODUCTS_ENABLED
  ? ALL_SECTIONS
  : ALL_SECTIONS.filter((section) => section.key !== "products");
