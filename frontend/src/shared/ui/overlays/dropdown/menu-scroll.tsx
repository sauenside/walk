import type { ReactNode } from "react";

// Прокручиваемый участок меню для длинных списков: строка не выше 170px, список внутри прокручивается
export const MenuScroll = ({ children }: { children: ReactNode }) => (
  <div className="menu-scroll">
    <div className="menu-scroll-list">{children}</div>
  </div>
);
