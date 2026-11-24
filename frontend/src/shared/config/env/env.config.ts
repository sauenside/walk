// Адрес бэкенда для сервера Next: на него ведёт rewrite /api и запросы из серверных компонентов
const API_ORIGIN = process.env.API_PROXY_TARGET ?? "http://localhost:5000";

export const env = {
  // В браузере запросы идут через rewrite из next.config.ts
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  apiOrigin: API_ORIGIN,
};
