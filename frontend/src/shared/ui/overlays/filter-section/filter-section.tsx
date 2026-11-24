import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import "./filter-section.css";

type FilterSectionProps = {
  title: string;
  // Текущее значение показывается в заголовке, пока раздел свёрнут
  value: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export const FilterSection = ({ title, value, open, onToggle, children }: FilterSectionProps) => (
  <div className={cx("filter-section", open && "is-open")}>
    <button type="button" className="filter-section-head" onClick={onToggle}>
      <ChevronRight size={ICON_SIZE.small} strokeWidth={ICON_STROKE.bold} className="filter-section-chevron" />
      <div className="filter-section-title">{formatText(title, TEXT_CASE.title)}</div>
      <div className="filter-section-value">{formatText(value, TEXT_CASE.label)}</div>
    </button>
    {open && <div className="filter-section-body">{children}</div>}
  </div>
);
