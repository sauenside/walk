import { createZodDto, requireAnyField } from "@/shared/zod";
import { createCategorySchema } from "./create-category.dto";

export const updateCategorySchema = requireAnyField(createCategorySchema.partial());

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}
