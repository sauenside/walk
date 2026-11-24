"use client";

import { useRouter } from "next/navigation";
import { CategoryActionsMenu } from "@/features/secret/category-bulk-actions";
import { CreateCategoryButton } from "@/features/secret/category-form";
import { ROUTES } from "@/shared/config/routes";
import { ResourcePage, ResourcePageActions } from "@/shared/ui/templates/resource-page";
import { CategoryMetrics } from "@/widgets/secret/category-metrics";
import { CategoryTable } from "@/widgets/secret/category-table";
import { CategoryToolbar } from "@/widgets/secret/category-toolbar";

// Страница только раскладывает блоки по местам каркаса и связывает фичи, которые не знают друг о друге.
// Порядок блоков задаёт ResourcePage — общий для всех страниц
export const CategoriesRoute = () => {
  const router = useRouter();

  return (
    <ResourcePage
      actions={
        <ResourcePageActions>
          <CreateCategoryButton />
          <CategoryActionsMenu
            onEdit={(id) => router.push(ROUTES.secret.category(id))}
            onAddChild={(parentId) => router.push(ROUTES.secret.categoryNew(parentId))}
          />
        </ResourcePageActions>
      }
      metrics={<CategoryMetrics />}
      toolbar={<CategoryToolbar />}
      table={<CategoryTable />}
    />
  );
};
