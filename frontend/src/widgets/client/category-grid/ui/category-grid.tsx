"use client";

import { CategoryMedia, useClientCategories } from "@/entities/category";
import { ICON_SIZE } from "@/shared/config/icon";
import type { Locale } from "@/shared/config/langs";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import { Spinner } from "@/shared/ui/primitives/spinner";
import "./category-grid.css";

const SOON: Record<Locale, string> = {
  ru: "скоро",
  kk: "жақында",
  en: "soon",
};

export const CategoryGrid = ({ locale }: { locale: Locale }) => {
  const { data: categories, isPending } = useClientCategories(locale);

  if (isPending) {
    return (
      <div className="category-grid-pending">
        <Spinner size={ICON_SIZE.large} />
      </div>
    );
  }

  return (
    <div className="category-grid">
      {categories?.map((category) => (
        <div
          key={category.id}
          className={cx("category-card", !category.isActive && "is-disabled")}
        >
          <div className="category-card-head">
            <CategoryMedia
              mediaType={category.mediaType}
              emoji={category.emoji}
              picture={category.picture}
              size="lg"
            />
            {!category.isActive && <div className="category-card-soon">{formatText(SOON[locale], TEXT_CASE.label)}</div>}
          </div>
          <div className="category-card-name">{formatText(category.name, TEXT_CASE.name)}</div>
          {category.description && <div className="category-card-description">{category.description}</div>}
          {category.children.length > 0 && (
            <div className="category-card-children">
              {category.children.map((child) => (
                <div key={child.id} className={cx("category-card-child", !child.isActive && "is-disabled")}>
                  {child.emoji && <div className="category-card-child-emoji">{child.emoji}</div>}
                  {formatText(child.name, TEXT_CASE.name)}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
