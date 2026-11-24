import { z } from "zod";
import { mediaSchema } from "@/entities/media/@x/category";
import { mediaTypeSchema } from "./category.schema";

// Категория на витрине: один язык; скрытые (isEnabled: false) сервер не отдаёт,
// isActive: false — видна серой с пометкой «Скоро»
export const clientSubcategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  mediaType: mediaTypeSchema,
  emoji: z.string().nullable(),
  picture: mediaSchema.nullable(),
});

export const clientCategorySchema = clientSubcategorySchema.extend({
  description: z.string().nullable(),
  children: z.array(clientSubcategorySchema),
});

export type ClientSubcategory = z.infer<typeof clientSubcategorySchema>;
export type ClientCategory = z.infer<typeof clientCategorySchema>;
