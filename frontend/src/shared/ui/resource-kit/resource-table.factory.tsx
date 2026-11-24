"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { createColumnHelper, tableFeatures, useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import type { SelectionStore } from "@/shared/lib/store-factories";
import { Button } from "../controls/button";
import { Checkbox } from "../controls/checkbox";
import { Spinner } from "../primitives/spinner";
import {
  ResourcePageEmpty,
  ResourcePageLoader,
  ResourcePageTable,
  ResourceTable,
  ResourceTableCell,
  ResourceTableRow,
} from "../templates/resource-page";
import "./resource-kit.css";

// Таблице нужны только колонки и строки: сортировка и фильтры считаются на сервере
export const resourceTableFeatures = tableFeatures({});

export type ResourceTableFeatures = typeof resourceTableFeatures;

// Помощник для колонок ресурса: column.display({ id, header, cell })
export const createResourceColumnHelper = <TRow extends RowData>() => createColumnHelper<ResourceTableFeatures, TRow>();

export type ColumnLayout = {
  // Скрыть колонку на телефоне; сетку без неё задаёт mobileColumnsTemplate
  desktopOnly?: boolean;
  align?: "start" | "end" | "center";
  muted?: boolean;
  className?: string;
};

type ResourceTableConfig<TRow extends RowData, TSelected extends { id: string }> = {
  columns: ColumnDef<ResourceTableFeatures, TRow, any>[];
  // Сетка колонок без колонки выбора — её фабрика добавляет сама
  columnsTemplate: string;
  minWidth: number;
  // На телефоне: сетка только видимых колонок (без колонки выбора) и минимальная ширина
  mobileColumnsTemplate?: string;
  mobileMinWidth?: number;
  layout?: Record<string, ColumnLayout>;
  getRowId: (row: TRow) => string;
  getRowClassName?: (row: TRow) => string | false | undefined;
  // Записей ещё нет вообще: «Категорий пока нет» и подсказка, что делать
  emptyState: { icon: ReactNode; title: string; text: string };
  selection: {
    useStore: SelectionStore<TSelected>;
    // Снимок строки для «Действий»
    toItem: (row: TRow) => TSelected;
  };
};

type ResourceDataTableProps<TRow extends RowData> = {
  rows: TRow[];
  pending: boolean;
  // none — записей ещё нет; not-found — есть, но под поиск и фильтры ничего не подошло
  emptyKind?: "none" | "not-found";
  // Кнопка в пустом состоянии «пока нет», например «Создать категорию»
  createAction?: ReactNode;
  // «Сбросить всё» в состоянии «ничего не найдено»
  onReset?: () => void;
  striped?: boolean;
  className?: string;
  // Что показать в шапке колонки выбора, например «Развернуть все»
  selectHeader?: ReactNode;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

const SELECT_COLUMN_WIDTH = "50px";

export const createResourceTable = <TRow extends RowData, TSelected extends { id: string }>({
  columns,
  columnsTemplate,
  minWidth,
  mobileColumnsTemplate,
  mobileMinWidth,
  layout = {},
  getRowId,
  getRowClassName,
  emptyState,
  selection,
}: ResourceTableConfig<TRow, TSelected>) => {
  const column = createResourceColumnHelper<TRow>();

  // Отмечается только кликом точно по кругу: клик по строке ничего не делает
  const SelectCell = ({ row }: { row: TRow }) => {
    const id = getRowId(row);
    const checked = selection.useStore((state) => state.selected.has(id));
    const toggle = selection.useStore((state) => state.toggle);
    return <Checkbox checked={checked} onChange={() => toggle(selection.toItem(row))} />;
  };

  const allColumns = [
    ...columns,
    column.display({ id: "select", header: "", cell: ({ row }) => <SelectCell row={row.original} /> }),
  ];

  const cellLayout = (id: string): ColumnLayout => (id === "select" ? { align: "center" } : (layout[id] ?? {}));

  const ResourceDataTable = ({
    rows,
    pending,
    emptyKind,
    createAction,
    onReset,
    striped,
    className,
    selectHeader,
    hasMore,
    loadingMore,
    onLoadMore,
  }: ResourceDataTableProps<TRow>) => {
    const selected = selection.useStore((state) => state.selected);

    const table = useTable({ features: resourceTableFeatures, columns: allColumns, data: rows, getRowId });

    if (pending) {
      return (
        <ResourcePageTable
          empty={
            <div className="resource-table-pending">
              <Spinner size={ICON_SIZE.large} />
            </div>
          }
        />
      );
    }

    if (emptyKind === "none") {
      return <ResourcePageTable empty={<ResourcePageEmpty {...emptyState} action={createAction} />} />;
    }

    if (emptyKind === "not-found") {
      return (
        <ResourcePageTable
          empty={
            <ResourcePageEmpty
              icon={<Search size={ICON_SIZE.extraLarge} />}
              title="ничего не найдено"
              text="измените запрос или сбросьте фильтры"
              action={onReset && <Button onClick={onReset}>сбросить всё</Button>}
            />
          }
        />
      );
    }

    return (
      <ResourcePageTable>
        <ResourceTable
          columns={`${columnsTemplate} ${SELECT_COLUMN_WIDTH}`}
          minWidth={minWidth}
          mobileColumns={mobileColumnsTemplate && `${mobileColumnsTemplate} ${SELECT_COLUMN_WIDTH}`}
          mobileMinWidth={mobileMinWidth}
          striped={striped}
          className={className}
        >
          {table.getHeaderGroups().map((group) => (
            <ResourceTableRow key={group.id} header>
              {group.headers.map((header) => (
                <ResourceTableCell key={header.id} {...cellLayout(header.column.id)}>
                  {header.column.id === "select" ? (
                    selectHeader
                  ) : typeof header.column.columnDef.header === "string" ? (
                    formatText(header.column.columnDef.header, TEXT_CASE.label)
                  ) : (
                    <table.FlexRender header={header} />
                  )}
                </ResourceTableCell>
              ))}
            </ResourceTableRow>
          ))}

          {table.getRowModel().rows.map((row) => (
            <ResourceTableRow
              key={row.id}
              className={cx(getRowClassName?.(row.original), selected.has(row.id) && "is-checked")}
            >
              {row.getAllCells().map((cell) => (
                <ResourceTableCell key={cell.id} {...cellLayout(cell.column.id)}>
                  <table.FlexRender cell={cell} />
                </ResourceTableCell>
              ))}
            </ResourceTableRow>
          ))}
        </ResourceTable>

        <ResourcePageLoader hasMore={hasMore} loading={loadingMore} onLoadMore={onLoadMore} />
      </ResourcePageTable>
    );
  };

  return ResourceDataTable;
};
