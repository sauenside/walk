import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import "./resource-page-empty.css";

type ResourcePageEmptyProps = {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
};

// «Пока нет» или «Ничего не найдено» внутри карточки таблицы
export const ResourcePageEmpty = ({ icon, title, text, action }: ResourcePageEmptyProps) => (
  <div className="resource-page-empty">
    {icon}
    <div className="resource-page-empty-title">{formatText(title, TEXT_CASE.title)}</div>
    <div className="resource-page-empty-text">{formatText(text, TEXT_CASE.hint)}</div>
    {action}
  </div>
);
