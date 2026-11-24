"use client";

import { useRouter } from "next/navigation";
import { CategoryEditor } from "@/features/secret/category-form";
import { MediaDropzone } from "@/features/secret/media-upload";
import { ROUTES } from "@/shared/config/routes";
import { Page } from "@/shared/ui/templates/page";
import { useHeaderTitle } from "@/widgets/secret/header";

type CategoryEditorRouteProps =
  | { mode: "create"; parentId: string | null }
  | { mode: "edit"; categoryId: string };

// Страница формы категории: создание (в корень или в родителя) и изменение.
// В шапке — стрелка назад к списку и название формы
export const CategoryEditorRoute = (props: CategoryEditorRouteProps) => {
  const router = useRouter();
  const categoryId = props.mode === "edit" ? props.categoryId : undefined;

  // Имя категории видно в строке над вкладками, в шапке — что за страница
  const title =
    props.mode === "edit" ? "редактирование категории" : props.parentId ? "новая подкатегория" : "новая категория";
  useHeaderTitle(title, ROUTES.secret.categories);

  return (
    <Page>
      <CategoryEditor
        categoryId={categoryId}
        parentId={props.mode === "create" ? props.parentId : null}
        renderMediaPicker={(pickerProps) => <MediaDropzone {...pickerProps} />}
        // Создали — открываем страницу новой категории; изменили — остаёмся
        onSaved={(saved) => {
          if (props.mode === "create") router.push(ROUTES.secret.category(saved.id));
        }}
        onCancel={() => router.push(ROUTES.secret.categories)}
      />
    </Page>
  );
};
