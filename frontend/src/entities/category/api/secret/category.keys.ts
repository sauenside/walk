import { createQueryKeys } from "@/shared/api/factories";
import type { CategoryListQuery } from "./category.api";

export const secretCategoryKeys = createQueryKeys<CategoryListQuery>("secret", "categories");
