import type { Category } from "@/entities/category";
import { pick } from "@/shared/lib/collections";
import { localizedKeys } from "@/shared/lib/localized";
import { createSelectionStore } from "@/shared/lib/store-factories";

// Храним не только id: «Действия» решают, что доступно, по уровню и счётчикам отмеченных строк
const SELECTED_KEYS = [
  "id",
  ...localizedKeys("name"),
  "parentId",
  "childrenCount",
  "productsCount",
] as const satisfies readonly (keyof Category)[];

export type SelectedCategory = Pick<Category, (typeof SELECTED_KEYS)[number]>;

export const useCategorySelection = createSelectionStore<SelectedCategory>();

// Удалить можно только пустые: без подкатегорий и товаров
export const isDeletable = ({ childrenCount, productsCount }: SelectedCategory) =>
  childrenCount === 0 && (productsCount ?? 0) === 0;

export const toSelectedCategory = (category: SelectedCategory): SelectedCategory => pick(category, SELECTED_KEYS);
