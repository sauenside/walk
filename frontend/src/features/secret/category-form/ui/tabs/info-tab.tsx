import { CATEGORY_PRODUCTS_ENABLED, type Category } from "@/entities/category";
import { formatNumber } from "@/shared/lib/formatters";
import { RecordInfo } from "@/shared/ui/form/record-info";

export const InfoTab = ({ category }: { category: Category }) => (
  <RecordInfo
    record={category}
    rows={[
      { label: "подкатегорий", value: category.childrenCount },
      ...(CATEGORY_PRODUCTS_ENABLED ? [{ label: "товаров", value: formatNumber(category.productsCount ?? 0) }] : []),
    ]}
  />
);
