import type { ReactNode } from "react";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import "./setting-row.css";

export const SettingList = ({ children }: { children: ReactNode }) => (
  <div className="setting-list">{children}</div>
);

type SettingRowProps = {
  // id элемента управления: клик по подписи переключает его
  controlId: string;
  label: string;
  hint?: string;
  disabled?: boolean;
  control: ReactNode;
};

export const SettingRow = ({ controlId, label, hint, disabled, control }: SettingRowProps) => (
  <div className={cx("setting-row", disabled && "is-disabled")}>
    <div className="setting-row-text">
      <label htmlFor={controlId} className="setting-row-label">
        {formatText(label, TEXT_CASE.label)}
      </label>
      {hint && <div className="setting-row-hint">{formatText(hint, TEXT_CASE.hint)}</div>}
    </div>
    {control}
  </div>
);
