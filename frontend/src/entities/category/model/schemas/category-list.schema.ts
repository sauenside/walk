import { z } from "zod";
import { cursorPageSchema, type CursorPage } from "@/shared/api/schemas";
import { categoryParentSchema, categorySchema } from "./category.schema";

// Строка списка: в дереве у корневой есть children, в плоском списке у подкатегории есть parent
export const categoryListItemSchema = categorySchema.extend({
  children: z.array(categorySchema).optional(),
  parent: categoryParentSchema.nullable().optional(),
});

export type CategoryListItem = z.infer<typeof categoryListItemSchema>;

export const categoryPageSchema = cursorPageSchema(categoryListItemSchema);

export type CategoryPage = CursorPage<CategoryListItem>;
