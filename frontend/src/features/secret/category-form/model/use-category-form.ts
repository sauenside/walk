import { useForm } from "@tanstack/react-form";
import type { Lang } from "@/shared/config/langs";
import { createCategoryFormSchema, type CategoryFormValues } from "./category-form.schema";

// Проверка zod-схемой при отправке; ошибки попадают в поля по их путям.
// Сохраняет окно (useUpsertModal), а не сама форма
export const useCategoryForm = (defaultValues: CategoryFormValues, requiredLangs: readonly Lang[]) =>
  useForm({
    defaultValues,
    validators: { onSubmit: createCategoryFormSchema(requiredLangs) },
  });

export type CategoryForm = ReturnType<typeof useCategoryForm>;
