import { Building2, LayoutGrid, Megaphone, Settings, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { PENDING_ROUTE, ROUTES } from "@/shared/config/routes";

export type NavigationItem = {
  key: string;
  label: string;
  // PENDING_ROUTE — страницы ещё нет
  href: string;
  // Что это за страница: показывается в поповере по клику на название в шапке
  description?: string;
};

export type NavigationSection = {
  key: string;
  title: string;
  // Иконка раздела: слева от названия, в узкой панели — кнопка раздела
  icon: LucideIcon;
  items: NavigationItem[];
};

// Разделы и страницы панели. Новая страница — одна строка; когда она готова, PENDING_ROUTE меняется на адрес
export const NAVIGATION: NavigationSection[] = [
  {
    key: "catalog",
    title: "каталог",
    icon: LayoutGrid,
    items: [
      { key: "menu", label: "меню", href: PENDING_ROUTE },
      {
        key: "categories",
        label: "категории",
        href: ROUTES.secret.categories,
        description:
          "дерево каталога в два уровня, здесь задаются названия на трёх языках, оформление и то, что видят покупатели",
      },
      { key: "products", label: "товары", href: PENDING_ROUTE },
    ],
  },
  {
    key: "configuration",
    title: "конфигурация",
    icon: SlidersHorizontal,
    items: [
      {
        key: "attributes",
        label: "атрибуты",
        href: PENDING_ROUTE,
      },
      {
        key: "modifiers",
        label: "модификаторы",
        href: PENDING_ROUTE,
      },
    ],
  },
  {
    key: "content",
    title: "контент и маркетинг",
    icon: Megaphone,
    items: [
      { key: "notes", label: "заметки", href: PENDING_ROUTE },
      {
        key: "composites",
        label: "компоненты",
        href: PENDING_ROUTE,
      },
      {
        key: "promotions",
        label: "акции",
        href: PENDING_ROUTE,
      },
    ],
  },
  {
    key: "business",
    title: "бизнес",
    icon: Building2,
    items: [
      { key: "branches", label: "филиалы", href: PENDING_ROUTE },
      {
        key: "vacancies",
        label: "вакансии",
        href: PENDING_ROUTE,
      },
      {
        key: "reviews",
        label: "отзывы",
        href: PENDING_ROUTE,
      },
    ],
  },
  {
    key: "system",
    title: "система",
    icon: Settings,
    items: [
      {
        key: "settings",
        label: "настройки",
        href: ROUTES.secret.settings,
        description: "общие настройки сайта по вкладкам: какие языки видят покупатели и на каком сайт открывается",
      },
    ],
  },
];

// Страница и её раздел по адресу: подсветка пункта в боковой панели, раскрытие раздела, название в шапке
export const findActive = (pathname: string) => {
  for (const section of NAVIGATION) {
    const item = section.items.find(
      (candidate) =>
        candidate.href !== PENDING_ROUTE &&
        (pathname === candidate.href ||
          pathname.startsWith(`${candidate.href}/`)),
    );
    if (item) return { section, item };
  }
  return null;
};