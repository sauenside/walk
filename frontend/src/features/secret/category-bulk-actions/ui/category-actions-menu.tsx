import { FolderPlus } from "lucide-react";
import {
  CATEGORY_ERROR_MESSAGES,
  CATEGORY_NOUNS,
  CATEGORY_PRODUCTS_ENABLED,
  canHaveChildren,
  useBulkDeleteCategories,
  useBulkUpdateCategories,
} from "@/entities/category";
import { ICON_SIZE } from "@/shared/config/icon";
import { displayName } from "@/shared/lib/localized";
import { MenuItem } from "@/shared/ui/overlays/dropdown";
import { createResourceActionsMenu } from "@/shared/ui/resource-kit";
import { isDeletable, useCategorySelection, type SelectedCategory } from "../model/selection.store";

type CategoryActionsProps = {
  // Открытие формы — другая фича, поэтому действие приходит снаружи
  onAddChild: (parentId: string) => void;
};

export const CategoryActionsMenu = createResourceActionsMenu<SelectedCategory, CategoryActionsProps>({
  useSelection: useCategorySelection,
  useBulkUpdate: useBulkUpdateCategories,
  useBulkDelete: useBulkDeleteCategories,
  isDeletable,
  getLabel: displayName,
  nouns: CATEGORY_NOUNS,
  deleteRule: CATEGORY_PRODUCTS_ENABLED
    ? "удалить можно только категории без подкатегорий и товаров"
    : "удалить можно только категории без подкатегорий",
  errorMessages: CATEGORY_ERROR_MESSAGES,
  // Своё у категорий: подкатегорию можно добавить только в одну корневую
  renderExtraItems: ({ single, close }, { onAddChild }) => (
    <MenuItem
      icon={<FolderPlus size={ICON_SIZE.small} />}
      disabled={!single || !canHaveChildren(single)}
      hint={single && canHaveChildren(single) ? undefined : "одну корневую"}
      onClick={() => {
        if (single) onAddChild(single.id);
        close();
      }}
    >
      добавить подкатегорию
    </MenuItem>
  ),
});
