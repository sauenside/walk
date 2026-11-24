import { z } from "zod";
import { createZodDto } from "../zod";

export const ID_PATTERN = /^[A-Za-z0-9_-]{21}$/;

export const idSchema = z.string().regex(ID_PATTERN, { message: "invalid id" });

export const idParamSchema = z.object({ id: idSchema });

export class IdParamDto extends createZodDto(idParamSchema) {}
