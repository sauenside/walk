import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import "./segmented.css";

type SegmentedProps<T extends string> = {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

export const Segmented = <T extends string>({ options, value, onChange }: SegmentedProps<T>) => (
  <div
    className="segmented"
    style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={cx("segment", value === option.value && "is-active")}
        onClick={() => onChange(option.value)}
      >
        {formatText(option.label, TEXT_CASE.button)}
      </button>
    ))}
  </div>
);
