"use client";

import { Layers, Layers2, FolderOpen } from "lucide-react";
import { useSecretCategoryList, useSecretCategoryMetrics } from "@/entities/category";
import { toSelectedCategory, useCategorySelection } from "@/features/secret/category-bulk-actions";
import { useCategoryFiltersStore } from "@/features/secret/category-filter";
import { useCategorySortStore } from "@/features/secret/category-sort";
import { CreateCategoryButton } from "@/features/secret/category-form";
import { ICON_SIZE } from "@/shared/config/icon";
import { cx } from "@/shared/lib/dom";
import { IconButton } from "@/shared/ui/controls/icon-button";
import { createResourceTable } from "@/shared/ui/resource-kit";
import {
  CATEGORY_COLUMNS,
  CATEGORY_COLUMNS_TEMPLATE,
  CATEGORY_COLUMN_LAYOUT,
  CATEGORY_MOBILE_COLUMNS_TEMPLATE,
  CATEGORY_MOBILE_MIN_WIDTH,
  CATEGORY_TABLE_MIN_WIDTH,
} from "../model/category.columns";
import { useCategoryRows, type CategoryRow } from "../model/use-category-rows";
import "./category-table.css";

const CategoryDataTable = createResourceTable({
  columns: CATEGORY_COLUMNS,
  columnsTemplate: CATEGORY_COLUMNS_TEMPLATE,
  minWidth: CATEGORY_TABLE_MIN_WIDTH,
  mobileColumnsTemplate: CATEGORY_MOBILE_COLUMNS_TEMPLATE,
  mobileMinWidth: CATEGORY_MOBILE_MIN_WIDTH,
  layout: CATEGORY_COLUMN_LAYOUT,
  getRowId: (row: CategoryRow) => row.category.id,
  getRowClassName: ({ kind, isOpen, isLast }) =>
    cx("category-row", `category-row-${kind}`, isOpen && "is-open", isLast && "is-last"),
  emptyState: {
    icon: <FolderOpen size={ICON_SIZE.extraLarge} />,
    title: "категорий пока нет",
    text: "создайте первую категорию, подкатегории можно будет добавить в неё через «Действия»",
  },
  selection: {
    useStore: useCategorySelection,
    toItem: (row) => toSelectedCategory(row.category),
  },
});

export const CategoryTable = () => {
  const filters = useCategoryFiltersStore.useValue();
  const sort = useCategorySortStore.useValue();
  const resetAll = useCategoryFiltersStore((state) => state.resetAll);
  const list = useSecretCategoryList({ filters, sort });
  const { data: metrics } = useSecretCategoryMetrics();

  const { rows, allExpanded, canExpand, toggleAll } = useCategoryRows(list.data?.pages, list.view);
  const isTree = list.view === "tree";

  const emptyKind = metrics?.total === 0 ? "none" : rows.length === 0 ? "not-found" : undefined;

  return (
    <CategoryDataTable
      rows={rows}
      pending={list.isPending || !metrics}
      emptyKind={emptyKind}
      createAction={<CreateCategoryButton label="создать категорию" />}
      onReset={resetAll}
      striped={!isTree}
      className={cx("category-table", isTree ? "is-tree" : "is-flat")}
      selectHeader={
        isTree && (
          <IconButton
            size="sm"
            disabled={!canExpand}
            onClick={toggleAll}
          >
            {allExpanded ? <Layers2 size={ICON_SIZE.medium} /> : <Layers size={ICON_SIZE.medium} />}
          </IconButton>
        )
      }
      hasMore={!!list.hasNextPage}
      loadingMore={list.isFetchingNextPage}
      onLoadMore={() => list.fetchNextPage()}
    />
  );
};
