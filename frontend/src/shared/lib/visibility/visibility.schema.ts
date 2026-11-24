import { z } from "zod";

// Пара флагов видимости, общая для категорий и товаров, в значениях API:
// isEnabled: false убирает запись с витрины, isActive: false оставляет её видимой, но закрытой («Скоро»)
export const visibilitySchema = z.object({
  isActive: z.boolean(),
  isEnabled: z.boolean(),
});

export type Visibility = z.infer<typeof visibilitySchema>;

// Счётчики по статусам для статистики
export const visibilityCountsSchema = z.object({
  available: z.number().int(),
  unavailable: z.number().int(),
  hidden: z.number().int(),
});

export type VisibilityCounts = z.infer<typeof visibilityCountsSchema>;
