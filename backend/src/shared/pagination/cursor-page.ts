import { z } from "zod";
import { decodeCursor, encodeCursor } from "./cursor";

export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
  total: number;
};

export const cursorQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CursorQuery = z.infer<typeof cursorQuerySchema>;

export const toPrismaPage = ({ cursor, limit }: CursorQuery) => ({ skip: decodeCursor(cursor).offset, take: limit });

export const toCursorPage = <T>(items: T[], total: number, { cursor, limit }: CursorQuery): CursorPage<T> => {
  const end = decodeCursor(cursor).offset + items.length;
  return {
    items,
    nextCursor: items.length === limit && end < total ? encodeCursor({ offset: end }) : null,
    total,
  };
};
