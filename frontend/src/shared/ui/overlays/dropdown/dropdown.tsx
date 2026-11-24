"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatChildren } from "@/shared/lib/formatters";
import { useClickOutside, useEscape } from "@/shared/lib/hooks";
import "./dropdown.css";

type DropdownProps = {
  label: ReactNode;
  icon?: ReactNode;
  badge?: number;
  active?: boolean;
  disabled?: boolean;
  align?: "start" | "end";
  // compact — маленькая кнопка в заголовке группы; block — поле формы во всю ширину
  variant?: "default" | "compact" | "block";
  className?: string;
  children: (close: () => void) => ReactNode;
};

export const Dropdown = ({
  label,
  icon,
  badge,
  active,
  disabled,
  align = "start",
  variant = "default",
  className,
  children,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useClickOutside(ref, close, open);
  useEscape(close, { enabled: open, capture: true });

  return (
    <div
      ref={ref}
      className={cx("dropdown", variant !== "default" && `dropdown-${variant}`, open && "is-open", className)}
    >
      <button
        type="button"
        className={cx("dropdown-button", open && "is-open", (active || !!badge) && "has-value")}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        {icon}
        <div className="dropdown-label">{formatChildren(label, TEXT_CASE.button)}</div>
        {badge ? <div className="dropdown-badge">{badge}</div> : null}
        <ChevronDown size={ICON_SIZE.small} className="dropdown-chevron" />
      </button>
      {/* Якорь нулевой высоты: меню выпадает под кнопку поверх контента без top/left */}
      {open && !disabled && (
        <div className={cx("dropdown-anchor", `dropdown-anchor-${align}`)}>
          <div className="dropdown-menu">
            {children(close)}
          </div>
        </div>
      )}
    </div>
  );
};
