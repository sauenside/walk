export const ROUTES = {
  client: {
    home: "/",
  },
  secret: {
    root: "/secret",
    categories: "/secret/categories",
    // Новая категория; с parentId — подкатегория этой категории
    categoryNew: (parentId?: string | null) =>
      parentId ? `/secret/categories/new?parentId=${encodeURIComponent(parentId)}` : "/secret/categories/new",
    category: (id: string) => `/secret/categories/${encodeURIComponent(id)}`,
    settings: "/secret/settings",
  },
} as const;

// Ссылка на страницу, которой ещё нет: пункт меню виден, но никуда не ведёт
export const PENDING_ROUTE = "#";
