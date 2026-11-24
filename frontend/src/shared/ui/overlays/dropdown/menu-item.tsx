import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { ICON_SIZE, ICON_STROKE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatChildren, formatText, type TextCase } from "@/shared/lib/formatters";

type MenuItemProps = {
  // undefined — обычный пункт; true/false — пункт выбора с галочкой
  checked?: boolean;
  icon?: ReactNode;
  hint?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  // Свой регистр для этого пункта; по умолчанию — TEXT_CASE.button
  textCase?: TextCase;
  children: ReactNode;
};

export const MenuItem = ({
  checked,
  icon,
  hint,
  danger,
  disabled,
  onClick,
  textCase = TEXT_CASE.button,
  children,
}: MenuItemProps) => (
  <button
    type="button"
    disabled={disabled}
    className={cx("menu-item", danger && "menu-item-danger")}
    onClick={onClick}
  >
    <div className="menu-item-check">{checked ? <Check size={ICON_SIZE.small} strokeWidth={ICON_STROKE.bold} /> : icon}</div>
    <div className="menu-item-label">{formatChildren(children, textCase)}</div>
    <div className="menu-item-hint">{hint && formatText(hint, TEXT_CASE.hint)}</div>
  </button>
);
