import { useStore } from "@tanstack/react-form";
import type { CategoryRoot } from "@/entities/category";
import { quote } from "@/shared/lib/formatters";
import { displayName } from "@/shared/lib/localized";
import { VisibilitySettings } from "@/shared/ui/form/visibility-settings";
import { useChangeToast } from "@/shared/ui/overlays/toast";
import type { CategoryForm } from "../../model/use-category-form";

type VisibilityTabProps = {
  form: CategoryForm;
  roots: CategoryRoot[];
};

export const VisibilityTab = ({ form, roots }: VisibilityTabProps) => {
  const isActive = useStore(form.store, (state) => state.values.isActive);
  const isEnabled = useStore(form.store, (state) => state.values.isEnabled);
  const parentId = useStore(form.store, (state) => state.values.parentId);
  const parent = roots.find((root) => root.id === parentId);

  // Вкладка смонтирована всегда, поэтому предупреждение приходит сразу, как только выбрали скрытого родителя
  useChangeToast(
    "category-parent-hidden",
    parent && !parent.isEnabled
      ? `родитель ${quote(displayName(parent))} скрыт, поэтому покупатели не увидят и эту категорию`
      : undefined,
  );

  return (
    <VisibilitySettings
      idPrefix="category"
      value={{ isActive, isEnabled }}
      onChange={(patch) => {
        if (patch.isActive !== undefined) form.setFieldValue("isActive", patch.isActive);
        if (patch.isEnabled !== undefined) form.setFieldValue("isEnabled", patch.isEnabled);
      }}
    />
  );
};
