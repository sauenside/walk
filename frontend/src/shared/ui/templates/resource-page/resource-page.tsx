import type { ReactNode } from "react";
import { Page } from "../page";

type ResourcePageProps = {
  // Кнопка «Создать» и меню «Действия»
  actions?: ReactNode;
  metrics?: ReactNode;
  // Сортировка, поиск, фильтры
  toolbar?: ReactNode;
  table: ReactNode;
};

// Каркас страницы ресурса. Страница передаёт блоки по именам, порядок задаётся здесь —
// один на категории, товары, акции и остальные страницы панели. Чего нет — то не выводится
export const ResourcePage = ({ actions, metrics, toolbar, table }: ResourcePageProps) => (
  <Page>
    {actions}
    {metrics}
    {toolbar}
    {table}
  </Page>
);
