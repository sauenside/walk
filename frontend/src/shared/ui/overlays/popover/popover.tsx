"use client";

import { useRef, useState, type ReactNode } from "react";
import { cx } from "@/shared/lib/dom";
import { useClickOutside, useEscape } from "@/shared/lib/hooks";
import "./popover.css";

type PopoverProps = {
  // Что нажимают: текст, иконка, название страницы
  trigger: ReactNode;
  triggerClassName?: string;
  children: ReactNode;
};

// Кнопка и белая карточка под ней. Закрывается кликом мимо и по Esc
export const Popover = ({ trigger, triggerClassName, children }: PopoverProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useClickOutside(ref, close, open);
  useEscape(close, { enabled: open, capture: true });

  return (
    <div ref={ref} className={cx("popover", open && "is-open")}>
      <button type="button" className={cx("popover-trigger", triggerClassName)} onClick={() => setOpen((value) => !value)}>
        {trigger}
      </button>
      {/* Якорь нулевой высоты: карточка выпадает под кнопку поверх контента, как меню у Dropdown */}
      {open && (
        <div className="popover-anchor">
          <div className="popover-card">{children}</div>
        </div>
      )}
    </div>
  );
};
