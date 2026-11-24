import { z } from "zod";

// Массовые операции атомарны: меняются или удаляются все записи, иначе сервер возвращает ошибку
export const bulkResultSchema = z.object({
  count: z.number().int(),
});

export type BulkResult = z.infer<typeof bulkResultSchema>;
