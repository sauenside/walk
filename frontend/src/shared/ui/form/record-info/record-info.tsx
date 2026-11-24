import type { ReactNode } from "react";
import { cx } from "@/shared/lib/dom";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatDate, formatText } from "@/shared/lib/formatters";
import { SLUG_LABEL } from "@/shared/lib/slug";
import "./record-info.css";

export type RecordInfoRow = {
  label: string;
  value: ReactNode;
  // Моноширинный шрифт для id, slug и подобных значений
  mono?: boolean;
};

type RecordInfoProps = {
  record: { id: string; slug?: string; createdAt: string; updatedAt: string };
  // Свои строки сущности, например «Подкатегорий: 3»; идут после ID
  rows?: RecordInfoRow[];
};

// Служебные сведения о записи: ID, свои строки, адрес, даты
export const RecordInfo = ({ record, rows = [] }: RecordInfoProps) => {
  const all: RecordInfoRow[] = [
    { label: "ID", value: record.id, mono: true },
    ...rows,
    ...(record.slug ? [{ label: SLUG_LABEL, value: record.slug, mono: true }] : []),
    { label: "создано", value: formatDate(record.createdAt) },
    { label: "изменено", value: formatDate(record.updatedAt) },
  ];

  return (
    <div className="record-info">
      {all.map((row) => (
        <div key={row.label} className="record-info-row">
          <div className="record-info-label">{formatText(row.label, TEXT_CASE.label)}</div>
          <div className={cx("record-info-value", row.mono && "is-mono")}>{row.value}</div>
        </div>
      ))}
    </div>
  );
};
