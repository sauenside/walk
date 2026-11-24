import { useQuery } from "@tanstack/react-query";
import { createResourceHooks } from "@/shared/api/factories";
import { resolveCategoryView, secretCategoryApi, type CategoryListQuery } from "./category.api";
import { secretCategoryKeys } from "./category.keys";

// Размер порции: в дереве — корневые вместе со всеми подкатегориями, в плоском списке — строки
const PAGE_SIZE = { tree: 10, flat: 20 } as const;

export const secretCategoryHooks = createResourceHooks({
  keys: secretCategoryKeys,
  api: secretCategoryApi,
  toParams: (query: CategoryListQuery, cursor) => {
    const view = resolveCategoryView(query.filters);
    return { ...query, view, cursor, limit: PAGE_SIZE[view] };
  },
});

export const useSecretCategoryList = (query: CategoryListQuery) => ({
  ...secretCategoryHooks.useList(query),
  view: resolveCategoryView(query.filters),
});

export const useSecretCategory = secretCategoryHooks.useDetail;

export const useSecretCategoryMetrics = () =>
  useQuery({
    queryKey: secretCategoryKeys.extra("metrics"),
    queryFn: secretCategoryApi.metrics,
  });

export const useSecretCategoryRoots = () =>
  useQuery({
    queryKey: secretCategoryKeys.extra("roots"),
    queryFn: secretCategoryApi.roots,
  });
