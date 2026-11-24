import { z } from "zod";

export const SORT_ORDERS = ["asc", "desc"] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export const sortQueryShape = <const Fields extends readonly [string, ...string[]]>(
  fields: Fields,
  defaultField: Fields[number],
  defaultOrder: SortOrder = "asc",
) => ({
  sortBy: z.enum(fields).default(defaultField as never),
  sortOrder: z.enum(SORT_ORDERS).default(defaultOrder),
});

// Добавка по id делает порядок однозначным, иначе offset-страницы теряют и дублируют строки
export const toStableOrderBy = <T>(orderBy: T) => [orderBy, { id: "asc" as const }];
