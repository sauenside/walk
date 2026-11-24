import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatChildren } from "@/shared/lib/formatters";
import "./resource-page-toolbar.css";

type ResourcePageToolbarProps = {
  sort: ReactNode;
  search: ReactNode;
  filter: ReactNode;
  // Вторая строка: активные фильтры. Пропускается, когда фильтров нет
  chips?: ReactNode;
};

export const ResourcePageToolbar = ({ sort, search, filter, chips }: ResourcePageToolbarProps) => (
  <div className="resource-page-toolbar">
    <div className="resource-page-toolbar-controls">
      {sort}
      {search}
      {filter}
    </div>
    {chips}
  </div>
);

type ToolbarChipsProps = {
  // Подпись в конце строки, например «Найдено: 12»
  summary?: ReactNode;
  children: ReactNode;
};

export const ToolbarChips = ({ summary, children }: ToolbarChipsProps) => (
  <div className="toolbar-chips">
    {children}
    {summary && <div className="toolbar-chips-summary">{formatChildren(summary, TEXT_CASE.label)}</div>}
  </div>
);
