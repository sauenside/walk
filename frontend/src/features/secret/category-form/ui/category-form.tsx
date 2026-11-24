"use client";

import { useMemo, useState } from "react";
import { useStore } from "@tanstack/react-form";
import {
  CATEGORY_ERROR_MESSAGES,
  CategoryMedia,
  useCreateCategory,
  useSecretCategoryRoots,
  useUpdateCategory,
  type Category,
} from "@/entities/category";
import { useEnabledLangs } from "@/entities/settings";
import { SECRET_LANG, type Lang } from "@/shared/config/langs";
import { quote } from "@/shared/lib/formatters";
import { displayName } from "@/shared/lib/localized";
import { useLeaveGuard } from "@/shared/ui/form/leave-guard";
import { TabbedForm, useTabbedForm } from "@/shared/ui/form/tabbed-form";
import { toServerFieldErrors } from "../lib/server-field-errors";
import { toCategoryInput, toFormValues, type CategoryFormValues } from "../model/category-form.schema";
import { FIELD_LABEL, FIELD_TAB, FORM_TABS, getTabWarnings } from "../model/form-tabs.config";
import { useCategoryForm } from "../model/use-category-form";
import { InfoTab } from "./tabs/info-tab";
import { MainTab } from "./tabs/main-tab";
import { MediaTab, type MediaPickerRender } from "./tabs/media-tab";
import { PlacementTab } from "./tabs/placement-tab";
import { VisibilityTab } from "./tabs/visibility-tab";
import "./category-form.css";

type CategoryFormProps = {
  // Есть — изменение, нет — создание
  category: Category | undefined;
  parentId: string | null;
  defaultPosition: number;
  renderMediaPicker: MediaPickerRender;
  // После сохранения: получает сохранённую категорию
  onSaved: (category: Category) => void;
  // «Отмена»: несохранённые изменения сначала подтверждаются
  onCancel: () => void;
};

// Форма категории на странице: создание и изменение, все поля, сохранение и предупреждение об уходе
export const CategoryForm = ({
  category,
  parentId,
  defaultPosition,
  renderMediaPicker,
  onSaved,
  onCancel,
}: CategoryFormProps) => {
  const { data: roots = [] } = useSecretCategoryRoots();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const [lang, setLang] = useState<Lang>(SECRET_LANG);
  const requiredLangs = useEnabledLangs();

  // Значения, с которыми форма открылась; после сохранения изменений — новые значения записи
  const initialValues = useMemo(
    () => toFormValues(category, { parentId, position: defaultPosition }),
    [category, parentId, defaultPosition],
  );
  const form = useCategoryForm(initialValues, requiredLangs);
  const values = useStore(form.store, (state) => state.values);
  const name = displayName(values);
  const changed = JSON.stringify(values) !== JSON.stringify(initialValues);
  const confirmLeave = useLeaveGuard(changed);

  const controller = useTabbedForm({
    form,
    // «Информация» есть только у существующей категории
    tabs: FORM_TABS.filter((item) => item.value !== "info" || category),
    initialTab: "main",
    warnings: getTabWarnings(values, requiredLangs),
    fieldTab: FIELD_TAB,
    fieldLabels: FIELD_LABEL,
    serverErrors: toServerFieldErrors,
    errorMessages: CATEGORY_ERROR_MESSAGES,
    savedMessage: category
      ? `изменения в ${quote(name)} сохранены`
      : `${values.parentId ? "подкатегория" : "категория"} ${quote(name)} создана`,
    save: (formValues: CategoryFormValues) => {
      const input = toCategoryInput(formValues);
      return category
        ? updateCategory.mutateAsync({ id: category.id, input })
        : createCategory.mutateAsync(input);
    },
    onSaved,
  });

  const parent = roots.find((root) => root.id === values.parentId);

  return (
    <TabbedForm
      controller={controller}
      title={name}
      subtitle={parent ? `подкатегория в ${quote(displayName(parent))}` : "корневая категория"}
      media={<CategoryMedia mediaType={values.mediaType} emoji={values.emoji || null} picture={values.picture} size="md" />}
      submitLabel={category ? "сохранить" : "создать"}
      onCancel={() => confirmLeave(onCancel)}
      panels={{
        main: <MainTab form={form} lang={lang} onLangChange={setLang} requiredLangs={requiredLangs} />,
        placement: (
          <PlacementTab
            form={form}
            categoryId={category?.id}
            childrenCount={category?.childrenCount ?? 0}
            roots={roots}
          />
        ),
        media: <MediaTab form={form} renderMediaPicker={renderMediaPicker} />,
        visibility: <VisibilityTab form={form} roots={roots} />,
        info: category && <InfoTab category={category} />,
      }}
    />
  );
};
