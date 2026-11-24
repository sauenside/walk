import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import "./tabs.css";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  // Оранжевая точка: во вкладке есть незаполненные поля
  warning?: boolean;
};

type TabsProps<T extends string> = {
  tabs: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (value: T) => void;
};

export const Tabs = <T extends string>({ tabs, value, onChange }: TabsProps<T>) => (
  <div
    className="tabs"
    style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
  >
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        className={cx("tab", value === tab.value && "is-active")}
        onClick={() => onChange(tab.value)}
      >
        {formatText(tab.label, TEXT_CASE.label)}
        {tab.warning && <div className="tab-warning" />}
      </button>
    ))}
  </div>
);
