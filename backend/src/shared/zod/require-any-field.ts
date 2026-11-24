import type { z } from "zod";

export const requireAnyField = <T extends z.ZodType<Record<string, unknown>>>(schema: T) =>
  schema.refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "expected at least one field",
  });
