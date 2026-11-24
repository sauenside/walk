import { useQuery } from "@tanstack/react-query";
import type { Locale } from "@/shared/config/langs";
import { clientCategoryApi } from "./category.api";
import { clientCategoryKeys } from "./category.keys";

export const useClientCategories = (locale: Locale) =>
  useQuery({
    queryKey: clientCategoryKeys.list(locale),
    queryFn: () => clientCategoryApi.list(locale),
  });
