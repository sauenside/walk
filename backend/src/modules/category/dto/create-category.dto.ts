import { z } from "zod";
import { idSchema } from "@/shared/dto";
import { localizedShape } from "@/shared/i18n";
import { mediaShape } from "@/shared/media";
import { createZodDto, descriptionSchema, nameSchema, slugSchema } from "@/shared/zod";

export const createCategorySchema = z.strictObject({
  parentId: idSchema.nullable().optional(),
  slug: slugSchema,
  ...localizedShape("name", nameSchema),
  ...localizedShape("description", descriptionSchema),
  isActive: z.boolean().optional(),
  isEnabled: z.boolean().optional(),
  // Без позиции категория встаёт последней на своём уровне
  position: z.number().int().min(1).max(1_000_000).optional(),
  ...mediaShape,
});

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
