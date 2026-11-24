import { z } from "zod";
import { visibilityCountsSchema } from "@/shared/lib/visibility";

// Статистика по всем категориям, без учёта фильтров
export const categoryMetricsSchema = z.object({
  total: z.number().int(),
  roots: z.number().int(),
  status: visibilityCountsSchema,
  media: z.object({
    emoji: z.number().int(),
    picture: z.number().int(),
    none: z.number().int(),
  }),
});

export type CategoryMetrics = z.infer<typeof categoryMetricsSchema>;
