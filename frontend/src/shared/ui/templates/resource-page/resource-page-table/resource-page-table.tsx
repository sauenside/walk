import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/shared/lib/dom";
import "./resource-page-table.css";

type ResourcePageTableProps = {
  // Если передано пустое состояние, таблица не рисуется
  empty?: ReactNode;
  children?: ReactNode;
};

// Белая карточка таблицы с горизонтальной прокруткой на узких экранах
export const ResourcePageTable = ({ empty, children }: ResourcePageTableProps) => (
  <div className="resource-page-table">
    {empty ?? <div className="resource-page-table-scroll">{children}</div>}
  </div>
);

type ResourceTableProps = {
  // Сетка колонок, например "minmax(300px, 1fr) 160px 90px"
  columns: string;
  minWidth: number;
  // На телефоне: сетка без колонок «только на десктопе» и своя минимальная ширина
  mobileColumns?: string;
  mobileMinWidth?: number;
  striped?: boolean;
  className?: string;
  children: ReactNode;
};

export const ResourceTable = ({
  columns,
  minWidth,
  mobileColumns = columns,
  mobileMinWidth = minWidth,
  striped,
  className,
  children,
}: ResourceTableProps) => (
  <div
    className={cx("resource-table", striped && "is-striped", className)}
    style={
      {
        "--resource-table-columns": columns,
        "--resource-table-columns-mobile": mobileColumns,
        "--resource-table-min-width": `${minWidth}px`,
        "--resource-table-min-width-mobile": `${mobileMinWidth}px`,
      } as CSSProperties
    }
  >
    {children}
  </div>
);

type ResourceTableRowProps = {
  header?: boolean;
  className?: string;
  children: ReactNode;
};

export const ResourceTableRow = ({ header, className, children }: ResourceTableRowProps) => (
  <div className={cx("resource-table-row", header && "resource-table-head", className)}>
    {children}
  </div>
);

type ResourceTableCellProps = {
  // Скрыта на телефоне, чтобы строка была короче
  desktopOnly?: boolean;
  align?: "start" | "end" | "center";
  muted?: boolean;
  className?: string;
  children?: ReactNode;
};

export const ResourceTableCell = ({ desktopOnly, align = "start", muted, className, children }: ResourceTableCellProps) => (
  <div
    className={cx(
      "resource-table-cell",
      align !== "start" && `resource-table-cell-${align}`,
      muted && "resource-table-cell-muted",
      desktopOnly && "resource-table-cell-desktop",
      className,
    )}
  >
    {children}
  </div>
);
