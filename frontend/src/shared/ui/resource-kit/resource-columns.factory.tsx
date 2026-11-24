import type { RowData } from "@tanstack/react-table";
import { formatDate } from "@/shared/lib/formatters";
import { getVisibility, isHiddenByParent, type Visibility } from "@/shared/lib/visibility";
import { VisibilityStatus } from "../primitives/visibility-status";
import { createResourceColumnHelper, type ColumnLayout } from "./resource-table.factory";

type StatusSource = {
  item: Visibility;
  // Родитель записи (например, категория товара), если его скрытие прячет и запись
  parent?: { isEnabled: boolean } | null;
};

// Колонки, одинаковые у всех сущностей: сущность передаёт только, откуда брать значения
export const createStandardColumns = <TRow extends RowData>() => {
  const column = createResourceColumnHelper<TRow>();

  return {
    status: (read: (row: TRow) => StatusSource, hiddenByParentNote = "скрыта через родителя") =>
      column.display({
        id: "status",
        header: "статус",
        cell: ({ row }) => {
          const { item, parent } = read(row.original);
          return (
            <VisibilityStatus
              status={getVisibility(item)}
              note={isHiddenByParent(item, parent) ? hiddenByParentNote : undefined}
            />
          );
        },
      }),

    position: (read: (row: TRow) => number) =>
      column.display({ id: "position", header: "позиция", cell: ({ row }) => read(row.original) }),

    date: (id: "updatedAt" | "createdAt", read: (row: TRow) => string) =>
      column.display({
        id,
        header: id === "updatedAt" ? "изменено" : "создано",
        cell: ({ row }) => formatDate(read(row.original)),
      }),
  };
};

// Раскладка стандартных колонок: числа по правому краю, служебное — приглушённо и только на десктопе
export const STANDARD_COLUMN_LAYOUT: Record<string, ColumnLayout> = {
  position: { align: "end", muted: true, desktopOnly: true },
  updatedAt: { muted: true, desktopOnly: true },
  createdAt: { muted: true, desktopOnly: true },
};
