import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { formatText } from "@/shared/lib/formatters";
import "./resource-page-metrics.css";

type ResourcePageMetricsProps = {
  children: ReactNode;
};

export const ResourcePageMetrics = ({ children }: ResourcePageMetricsProps) => (
  <div className="resource-page-metrics">
    {children}
  </div>
);

type MetricProps = {
  value: ReactNode;
  // title нет намеренно: браузер рисует по нему тёмную подсказку, а подпись и так видна
  // Подпись перед числом и не зависит от него: «Категорий 38», «Доступна 1»
  label: string;
  icon?: ReactNode;
};

export const Metric = ({ value, label, icon }: MetricProps) => (
  <div className="metric">
    {icon && <div className="metric-icon">{icon}</div>}
    <div className="metric-label">{formatText(label, TEXT_CASE.label)}</div>
    <div className="metric-value">{value}</div>
  </div>
);
