"use client";

import { useSecretCategory, useSecretCategoryMetrics, type Category } from "@/entities/category";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import { Spinner } from "@/shared/ui/primitives/spinner";
import { CategoryForm } from "./category-form";
import type { MediaPickerRender } from "./tabs/media-tab";
import "./category-editor.css";

type CategoryEditorProps = {
  // Есть — изменение этой категории, нет — создание
  categoryId?: string;
  // Куда добавить новую: id родителя или null для корневой
  parentId: string | null;
  renderMediaPicker: MediaPickerRender;
  onSaved: (category: Category) => void;
  onCancel: () => void;
};

// Форма открывается, когда загружено всё нужное: категория при изменении,
// а при создании — место среди соседей, чтобы новая встала последней
export const CategoryEditor = ({ categoryId, parentId, renderMediaPicker, onSaved, onCancel }: CategoryEditorProps) => {
  const editing = useSecretCategory(categoryId ?? null);
  const { data: parent } = useSecretCategory(categoryId ? null : parentId);
  const { data: metrics } = useSecretCategoryMetrics();

  if (categoryId && editing.isError) {
    return <div className="category-editor-state">{formatText("категория не найдена, возможно, её уже удалили", TEXT_CASE.hint)}</div>;
  }

  const ready = categoryId ? !!editing.data : parentId ? !!parent : !!metrics;
  if (!ready) {
    return (
      <div className="category-editor-state">
        <Spinner size={ICON_SIZE.large} />
      </div>
    );
  }

  const siblings = (parentId ? parent?.childrenCount : metrics?.roots) ?? 0;

  return (
    <CategoryForm
      // Новая запись или другая категория — новая форма без старых значений
      key={categoryId ?? `new-${parentId ?? "root"}`}
      category={editing.data}
      parentId={categoryId ? (editing.data?.parentId ?? null) : parentId}
      defaultPosition={siblings + 1}
      renderMediaPicker={renderMediaPicker}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  );
};
