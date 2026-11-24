import { z } from "zod";

// Порция для подгрузки по скроллу: nextCursor === null — загружено всё
export const cursorPageSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
    total: z.number().int(),
  });

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  total: number;
};
