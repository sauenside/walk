import { secretCategoryHooks } from "./category.queries";

// Мутации из фабрики: после успеха сбрасывают весь кэш категорий
export const useCreateCategory = secretCategoryHooks.useCreate;
export const useUpdateCategory = secretCategoryHooks.useUpdate;
export const useBulkUpdateCategories = secretCategoryHooks.useBulkUpdate;
export const useBulkDeleteCategories = secretCategoryHooks.useBulkDelete;
