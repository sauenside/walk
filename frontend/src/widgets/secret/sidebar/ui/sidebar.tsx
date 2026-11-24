"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ICON_SIZE } from "@/shared/config/icon";
import {
  findActive,
  NAVIGATION,
  type NavigationItem,
  type NavigationSection,
} from "@/shared/config/navigation";
import { PROJECT_NAME } from "@/shared/config/project";
import { TEXT_CASE } from "@/shared/config/text-case";
import { cx } from "@/shared/lib/dom";
import { formatText } from "@/shared/lib/formatters";
import { useClickOutside, useEscape } from "@/shared/lib/hooks";
import { IconButton } from "@/shared/ui/controls/icon-button";
import { useSidebarStore } from "../model/sidebar.store";
import "./sidebar.css";

type ItemLinkProps = {
  item: NavigationItem;
  active: boolean;
  // Ещё одно действие по клику, например закрыть всплывающий список
  onNavigate?: () => void;
};

const ItemLink = ({ item, active, onNavigate }: ItemLinkProps) => {
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  return (
    <Link
      href={item.href}
      className={cx("sidebar-item", active && "is-active")}
      onClick={() => {
        setMobileOpen(false);
        onNavigate?.();
      }}
    >
      {formatText(item.label, TEXT_CASE.label)}
    </Link>
  );
};

type SectionProps = {
  section: NavigationSection;
  activeKey: string | undefined;
};

// Раздел в широкой панели: иконка и название; по клику раскрываются страницы
const Section = ({ section, activeKey }: SectionProps) => {
  const open = useSidebarStore((state) => state.openSections.includes(section.key));
  const toggleSection = useSidebarStore((state) => state.toggleSection);
  const Icon = section.icon;

  return (
    <div className={cx("sidebar-section", open && "is-open")}>
      <button type="button" className="sidebar-section-head" onClick={() => toggleSection(section.key)}>
        <Icon size={ICON_SIZE.medium} />
        {formatText(section.title, TEXT_CASE.title)}
      </button>
      {open && (
        <div className="sidebar-items">
          {section.items.map((item) => (
            <ItemLink key={item.key} item={item} active={activeKey === item.key} />
          ))}
        </div>
      )}
    </div>
  );
};

// Раздел в узкой панели: кнопка-иконка, по клику рядом открывается список его страниц.
// Закрывается кликом мимо, по Esc и при переходе на страницу
const SectionFlyout = ({ section, activeKey }: SectionProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  const Icon = section.icon;
  const current = section.items.some((item) => item.key === activeKey);

  useClickOutside(ref, close, open);
  useEscape(close, { enabled: open, capture: true });

  return (
    <div ref={ref} className={cx("sidebar-flyout", open && "is-open")}>
      <button
        type="button"
        className={cx("sidebar-section-button", current && "is-active", open && "is-open")}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon size={ICON_SIZE.medium} />
      </button>
      {open && (
        <div className="sidebar-flyout-card">
          <div className="sidebar-flyout-title">{formatText(section.title, TEXT_CASE.title)}</div>
          <div className="sidebar-items">
            {section.items.map((item) => (
              <ItemLink key={item.key} item={item} active={activeKey === item.key} onNavigate={close} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

type PanelProps = {
  collapsed: boolean;
  // Кнопка сужения есть только на десктопе
  collapsible: boolean;
  className?: string;
};

// Панель: название проекта и разделы. Широкая — разделы раскрываются списком, узкая — иконки разделов
const Panel = ({ collapsed, collapsible, className }: PanelProps) => {
  const pathname = usePathname();
  const activeKey = findActive(pathname)?.item.key;
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);

  return (
    <div className={cx("sidebar", collapsed && "is-collapsed", className)}>
      <div className="sidebar-head">
        {!collapsed && <div className="sidebar-title">{formatText(PROJECT_NAME, TEXT_CASE.title)}</div>}
        {collapsible && (
          <IconButton size="sm" onClick={toggleCollapsed}>
            {collapsed ? <PanelLeftOpen size={ICON_SIZE.medium} /> : <PanelLeftClose size={ICON_SIZE.medium} />}
          </IconButton>
        )}
      </div>
      <div className="sidebar-nav">
        {NAVIGATION.map((section) =>
          collapsed ? (
            <SectionFlyout key={section.key} section={section} activeKey={activeKey} />
          ) : (
            <Section key={section.key} section={section} activeKey={activeKey} />
          ),
        )}
      </div>
    </div>
  );
};

// Боковая панель панели управления: на десктопе слева, на телефоне выезжает поверх страницы
export const SecretSidebar = () => {
  const pathname = usePathname();
  const activeSection = findActive(pathname)?.section.key;
  const collapsed = useSidebarStore((state) => state.collapsed);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const openSection = useSidebarStore((state) => state.openSection);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  // Сначала читаем сохранённое, потом раскрываем раздел текущей страницы — иначе чтение затёрло бы его
  useEffect(() => {
    void Promise.resolve(useSidebarStore.persist.rehydrate()).then(() => {
      if (activeSection) useSidebarStore.getState().openSection(activeSection);
    });
    // Только при первом показе: раздел потом раскрывает эффект ниже
  }, []);

  useEffect(() => {
    if (activeSection) openSection(activeSection);
  }, [activeSection, openSection]);

  // Перешли на другую страницу — выехавшая панель закрывается
  useEffect(() => setMobileOpen(false), [pathname, setMobileOpen]);

  useEscape(() => setMobileOpen(false), { enabled: mobileOpen });

  return (
    <>
      <Panel collapsed={collapsed} collapsible className="sidebar-desktop" />
      {mobileOpen && (
        <div
          className="sidebar-drawer"
          onClick={(event) => {
            if (event.target === event.currentTarget) setMobileOpen(false);
          }}
        >
          <Panel collapsed={false} collapsible={false} />
        </div>
      )}
    </>
  );
};
