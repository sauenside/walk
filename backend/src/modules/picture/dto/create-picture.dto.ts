import { z } from "zod";
import { createZodDto } from "@/shared/zod";
import { PICTURE_CONTENT_TYPES, PICTURE_MAX_DIMENSION, PICTURE_MAX_SIZE } from "../picture.constants";

const dimensionSchema = z.number().int().positive().max(PICTURE_MAX_DIMENSION);

// Размеры в пикселях клиент берёт из самого файла до загрузки
export const createPictureSchema = z.strictObject({
  contentType: z.enum(PICTURE_CONTENT_TYPES),
  size: z.number().int().positive().max(PICTURE_MAX_SIZE),
  width: dimensionSchema,
  height: dimensionSchema,
});

export class CreatePictureDto extends createZodDto(createPictureSchema) {}
