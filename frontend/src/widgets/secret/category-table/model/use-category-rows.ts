import { useMemo } from "react";
import {
  categoryParentSchema,
  type Category,
  type CategoryListItem,
  type CategoryPage,
  type CategoryParent,
  type CategoryView,
} from "@/entities/category";
import { pick } from "@/shared/lib/collections";
import { useCategoryExpanded } from "./expanded.store";

// root — корневая в дереве, child — подкатегория в раскрытой группе, flat — строка плоского списка
export type CategoryRow = {
  category: Category;
  parent: CategoryParent | null;
  kind: "root" | "child" | "flat";
  isOpen: boolean;
  isLast: boolean;
};

// Поля родителя берём из его схемы, чтобы не перечислять их второй раз
const PARENT_KEYS = Object.keys(categoryParentSchema.shape) as (keyof CategoryParent)[];

const toParent = (item: CategoryListItem): CategoryParent => pick(item, PARENT_KEYS);

export const useCategoryRows = (pages: CategoryPage[] | undefined, view: CategoryView) => {
  const expanded = useCategoryExpanded((state) => state.expanded);
  const setAll = useCategoryExpanded((state) => state.setAll);

  const items = useMemo(() => pages?.flatMap((page) => page.items) ?? [], [pages]);

  const rows = useMemo<CategoryRow[]>(() => {
    if (view === "flat") {
      return items.map((item) => ({
        category: item,
        parent: item.parent ?? null,
        kind: "flat",
        isOpen: false,
        isLast: false,
      }));
    }

    return items.flatMap((root) => {
      const isOpen = expanded.has(root.id) && root.childrenCount > 0;
      const children = isOpen ? (root.children ?? []) : [];
      const parent = toParent(root);
      return [
        { category: root, parent: null, kind: "root", isOpen, isLast: false } satisfies CategoryRow,
        ...children.map(
          (child, index) =>
            ({
              category: child,
              parent,
              kind: "child",
              isOpen: false,
              isLast: index === children.length - 1,
            }) satisfies CategoryRow,
        ),
      ];
    });
  }, [items, view, expanded]);

  // «Развернуть все» действует только на загруженные категории с подкатегориями
  const expandable = view === "tree" ? items.filter((item) => item.childrenCount > 0).map((item) => item.id) : [];
  const allExpanded = expandable.length > 0 && expandable.every((id) => expanded.has(id));

  return {
    rows,
    allExpanded,
    canExpand: expandable.length > 0,
    toggleAll: () => setAll(expandable, !allExpanded),
  };
};
