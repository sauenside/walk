import { createServerFieldErrors, sameFields } from "@/shared/lib/form";
import { localizedFields, localizedKeys } from "@/shared/lib/localized";
import { RULE_MESSAGES } from "@/shared/lib/schemas";
import { MEDIA_RULE_MESSAGES, type CategoryFormValues } from "../model/category-form.schema";

type FormField = keyof CategoryFormValues;

// Ошибки полей из ответа API: { поле формы категории: текст }.
// Тексты те же, что у правил формы; свои — только для того, что проверяет один сервер
export const toServerFieldErrors = createServerFieldErrors<FormField>({
  fields: {
    ...sameFields(["slug", ...localizedKeys("name"), ...localizedKeys("description"), "parentId", "position", "emoji"]),
    // В форме картинка хранится объектом, в API — её id
    pictureId: "picture",
  },
  fieldMessages: {
    // Сервер требует название на каждом включённом языке
    ...localizedFields("name", () => RULE_MESSAGES.nameRequired),
    slug: RULE_MESSAGES.slugPattern,
    position: RULE_MESSAGES.position,
    emoji: MEDIA_RULE_MESSAGES.emoji,
    // Только сервер знает, есть ли такой родитель и такая картинка
    parentId: "родитель не найден, выберите другой",
    picture: "картинка не найдена или не загрузилась, загрузите её заново",
  },
  codeMessages: {
    CATEGORY_SLUG_TAKEN: { slug: "этот адрес уже занят другой категорией" },
  },
});
