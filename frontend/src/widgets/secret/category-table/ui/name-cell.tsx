"use client";

import { ChevronRight } from "lucide-react";
import { CategoryMedia, SUBCATEGORY_NOUNS } from "@/entities/category";
import { ICON_SIZE, ICON_STROKE } from "@/shared/config/icon";
import { cx } from "@/shared/lib/dom";
import { plural } from "@/shared/lib/formatters";
import { displayName } from "@/shared/lib/localized";
import { useCategoryExpanded } from "../model/expanded.store";
import type { CategoryRow } from "../model/use-category-rows";
import { TreeGuide } from "./tree-guide";

export const NameCell = ({ row }: { row: CategoryRow }) => {
  const { category, parent, kind, isOpen, isLast } = row;
  const toggle = useCategoryExpanded((state) => state.toggle);

  return (
    <div className="category-name">
      {kind === "child" && <TreeGuide isLast={isLast} />}
      {kind === "root" && (
        <button
          type="button"
          className={cx("category-disclosure", isOpen && "is-open")}
          disabled={category.childrenCount === 0}
          onClick={() => toggle(category.id)}
        >
          <ChevronRight size={ICON_SIZE.small} strokeWidth={ICON_STROKE.bold} />
        </button>
      )}
      <CategoryMedia mediaType={category.mediaType} emoji={category.emoji} picture={category.picture} />
      <div className="category-name-text">
        {kind === "flat" && parent && <div className="category-name-path">{displayName(parent)} ›</div>}
        <div className="category-name-main">{displayName(category)}</div>
        {!category.parentId && (
          <div className="category-name-meta">
            {category.childrenCount}{" "}
            {plural(category.childrenCount, SUBCATEGORY_NOUNS)}
          </div>
        )}
      </div>
    </div>
  );
};
