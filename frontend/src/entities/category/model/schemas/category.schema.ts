import { z } from "zod";
import { mediaSchema } from "@/entities/media/@x/category";
import { localizedMask } from "@/shared/lib/localized";
import { localizedTextShape, recordShape } from "@/shared/lib/schemas";
import { visibilitySchema } from "@/shared/lib/visibility";

export const mediaTypeSchema = z.enum(["NONE", "EMOJI", "PICTURE"]);

export type MediaType = z.infer<typeof mediaTypeSchema>;

// Категория в панели: все языки, видимость и счётчики
export const categorySchema = z.object({
  ...recordShape,
  slug: z.string(),

  ...localizedTextShape,

  ...visibilitySchema.shape,

  parentId: z.string().nullable(),

  position: z.number().int(),

  mediaType: mediaTypeSchema,
  emoji: z.string().nullable(),
  picture: mediaSchema.nullable(),

  childrenCount: z.number().int(),
  // Появится вместе с модулем товаров; пока сервер его не отдаёт
  productsCount: z.number().int().optional(),
});

export type Category = z.infer<typeof categorySchema>;

// Поля родителя для пути «Молочные продукты ›» в плоском списке и для проверки «скрыта через родителя»
const parentMask = { id: true, ...localizedMask("name"), isActive: true, isEnabled: true } as const;

export const categoryParentSchema = categorySchema.pick(parentMask);

export type CategoryParent = z.infer<typeof categoryParentSchema>;

// Корневая категория для выбора родителя в фильтре и форме: родитель + эмодзи
export const categoryRootSchema = categorySchema.pick({ ...parentMask, emoji: true });

export type CategoryRoot = z.infer<typeof categoryRootSchema>;

// Тело запроса на создание и изменение
export const categoryInputSchema = categorySchema
  .pick({
    slug: true,
    ...localizedMask("name"),
    ...localizedMask("description"),
    isActive: true,
    isEnabled: true,
    parentId: true,
    position: true,
    mediaType: true,
    emoji: true,
  })
  .extend({ pictureId: z.string().nullable() });

export type CategoryInput = z.infer<typeof categoryInputSchema>;
