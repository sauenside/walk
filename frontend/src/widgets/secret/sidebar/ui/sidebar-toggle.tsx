"use client";

import { Menu } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import { IconButton } from "@/shared/ui/controls/icon-button";
import { useSidebarStore } from "../model/sidebar.store";
import "./sidebar.css";

// Кнопка ☰: на телефоне выдвигает боковую панель; на десктопе скрыта — панель и так видна
export const SidebarToggle = () => {
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <IconButton className="sidebar-toggle" onClick={() => setMobileOpen(true)}>
      <Menu size={ICON_SIZE.medium} />
    </IconButton>
  );
};
