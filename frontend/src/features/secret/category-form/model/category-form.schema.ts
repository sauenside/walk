import { z } from "zod";
import { mediaTypeSchema, type Category, type CategoryInput } from "@/entities/category";
import { mediaSchema } from "@/entities/media";
import type { Lang } from "@/shared/config/langs";
import { localizedFields, localizedShape } from "@/shared/lib/localized";
import { RULE_MESSAGES, descriptionRule, nameRule, positionRule, slugRule } from "@/shared/lib/schemas";

// Тексты правил оформления; «Выберите эмодзи» показываем и когда эмодзи отклонил сервер
export const MEDIA_RULE_MESSAGES = {
  emoji: "выберите эмодзи",
  picture: "загрузите картинку",
} as const;

// requiredLangs — включённые на сайте языки: на них название обязательно, на остальных может быть пустым
export const createCategoryFormSchema = (requiredLangs: readonly Lang[]) =>
  z
    .object({
      slug: slugRule,
      // true, пока адрес не меняли вручную: тогда он собирается из русского названия
      slugAuto: z.boolean(),
      ...localizedShape("name", nameRule),
      ...localizedShape("description", descriptionRule),
      parentId: z.string().nullable(),
      position: positionRule,
      mediaType: mediaTypeSchema,
      emoji: z.string(),
      picture: mediaSchema.nullable(),
      isActive: z.boolean(),
      isEnabled: z.boolean(),
    })
    .superRefine((values, ctx) => {
      for (const lang of requiredLangs) {
        if (!values[`name${lang}`].trim()) {
          ctx.addIssue({ code: "custom", path: [`name${lang}`], message: RULE_MESSAGES.nameRequired });
        }
      }
      if (values.mediaType === "EMOJI" && !values.emoji.trim()) {
        ctx.addIssue({ code: "custom", path: ["emoji"], message: MEDIA_RULE_MESSAGES.emoji });
      }
      if (values.mediaType === "PICTURE" && !values.picture) {
        ctx.addIssue({ code: "custom", path: ["picture"], message: MEDIA_RULE_MESSAGES.picture });
      }
    });

export type CategoryFormValues = z.infer<ReturnType<typeof createCategoryFormSchema>>;

type FormDefaults = { parentId: string | null; position: number };

export const toFormValues = (category: Category | undefined, defaults: FormDefaults): CategoryFormValues =>
  category
    ? {
        slug: category.slug,
        slugAuto: false,
        ...localizedFields("name", (key) => category[key]),
        ...localizedFields("description", (key) => category[key] ?? ""),
        parentId: category.parentId,
        position: category.position,
        mediaType: category.mediaType,
        emoji: category.emoji ?? "",
        picture: category.picture,
        isActive: category.isActive,
        isEnabled: category.isEnabled,
      }
    : {
        slug: "",
        slugAuto: true,
        ...localizedFields("name", () => ""),
        ...localizedFields("description", () => ""),
        parentId: defaults.parentId,
        position: defaults.position,
        mediaType: "EMOJI",
        emoji: "🏷️",
        picture: null,
        isActive: true,
        isEnabled: true,
      };

// В API уходит только то, что относится к выбранному типу оформления; пустое описание сервер хранит как null
export const toCategoryInput = ({ emoji, picture, slugAuto: _slugAuto, ...values }: CategoryFormValues): CategoryInput => ({
  ...values,
  slug: values.slug.trim(),
  ...localizedFields("name", (key) => values[key].trim()),
  ...localizedFields("description", (key) => values[key].trim()),
  emoji: values.mediaType === "EMOJI" ? emoji.trim() : null,
  pictureId: values.mediaType === "PICTURE" ? (picture?.id ?? null) : null,
});
