import type { Lang } from "@/shared/config/langs";
import { localizedKeys, localizedLabels, missingLangs } from "@/shared/lib/localized";
import { SLUG_LABEL } from "@/shared/lib/slug";
import type { CategoryFormValues } from "./category-form.schema";

export type FormTab = "main" | "placement" | "media" | "visibility" | "info";

export const FORM_TABS: { value: FormTab; label: string }[] = [
  { value: "main", label: "основное" },
  { value: "placement", label: "размещение" },
  { value: "media", label: "оформление" },
  { value: "visibility", label: "видимость" },
  { value: "info", label: "информация" },
];

// На какой вкладке поле: туда переключаемся, если сервер его отклонил
export const FIELD_TAB: Partial<Record<keyof CategoryFormValues, FormTab>> = {
  ...Object.fromEntries([...localizedKeys("name"), ...localizedKeys("description")].map((key) => [key, "main"])),
  slug: "main",
  parentId: "placement",
  position: "placement",
  emoji: "media",
  picture: "media",
};

// Подписи полей в уведомлении об ошибках, в порядке формы
export const FIELD_LABEL: Partial<Record<keyof CategoryFormValues, string>> = {
  ...localizedLabels("name", "название"),
  ...localizedLabels("description", "описание"),
  slug: SLUG_LABEL,
  parentId: "родитель",
  position: "позиция",
  emoji: "эмодзи",
  picture: "картинка",
};

// Оранжевая точка на вкладке, где что-то не заполнено
export const getTabWarnings = (
  values: CategoryFormValues,
  requiredLangs: readonly Lang[],
): Partial<Record<FormTab, boolean>> => ({
  main: missingLangs(values, "name", requiredLangs).length > 0,
  media:
    (values.mediaType === "EMOJI" && !values.emoji.trim()) || (values.mediaType === "PICTURE" && !values.picture),
});
