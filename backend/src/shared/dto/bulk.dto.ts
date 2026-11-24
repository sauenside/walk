import { z } from "zod";
import { createZodDto } from "../zod";
import { idListSchema } from "./id-list.schema";

export const bulkIdsSchema = z.strictObject({
  ids: idListSchema,
});

export class BulkIdsDto extends createZodDto(bulkIdsSchema) {}

export const bulkFlagsSchema = z
  .strictObject({
    ids: idListSchema,
    isActive: z.boolean().optional(),
    isEnabled: z.boolean().optional(),
  })
  .refine(({ isActive, isEnabled }) => isActive !== undefined || isEnabled !== undefined, {
    message: "expected: isActive or isEnabled",
  });

export class BulkFlagsDto extends createZodDto(bulkFlagsSchema) {}
