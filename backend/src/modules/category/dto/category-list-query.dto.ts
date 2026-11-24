import { z } from "zod";
import { MediaType } from "@/shared/database";
import { idSchema } from "@/shared/dto";
import { cursorQuerySchema, sortQueryShape } from "@/shared/pagination";
import { booleanFlagSchema, createZodDto, searchSchema } from "@/shared/zod";

export const CATEGORY_SORT_FIELDS = ["position", "name", "createdAt", "updatedAt"] as const;

export type CategorySortField = (typeof CATEGORY_SORT_FIELDS)[number];

// tree — разделы порциями вместе с подкатегориями; flat — все подходящие категории подряд, у каждой её родитель
export const CATEGORY_VIEWS = ["tree", "flat"] as const;

export type CategoryView = (typeof CATEGORY_VIEWS)[number];

export const categoryListQuerySchema = cursorQuerySchema.extend({
  view: z.enum(CATEGORY_VIEWS).default("tree"),
  search: searchSchema,
  ...sortQueryShape(CATEGORY_SORT_FIELDS, "position"),
  // root — только разделы; id раздела — только его подкатегории (в tree — только этот раздел)
  parentId: z.union([z.literal("root"), idSchema]).optional(),
  isActive: booleanFlagSchema.optional(),
  isEnabled: booleanFlagSchema.optional(),
  mediaType: z.enum(MediaType).optional(),
});

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;

export class CategoryListQueryDto extends createZodDto(categoryListQuerySchema) {}
