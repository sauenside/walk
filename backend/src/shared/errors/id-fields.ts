import type { AppError } from "./app-error";

// { [id]: message } — так клиент видит, какие именно записи из bulk-запроса не прошли
export const toIdFields = (ids: string[], message: string) => Object.fromEntries(ids.map((id) => [id, message]));

export const assertAllFound = (ids: string[], rows: { id: string }[], onMissing: (missingIds: string[]) => AppError) => {
  const foundIds = new Set(rows.map((row) => row.id));
  const missingIds = ids.filter((id) => !foundIds.has(id));
  if (missingIds.length > 0) throw onMissing(missingIds);
};
