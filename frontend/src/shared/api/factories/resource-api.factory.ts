import type { z } from "zod";
import type { Visibility } from "@/shared/lib/visibility";
import { http } from "../client";
import { bulkResultSchema, type BulkResult } from "../schemas";

// Массово меняется только видимость: показать, скрыть, открыть или закрыть доступ
export type ResourceBulkUpdate = { ids: string[] } & Partial<Visibility>;

export type ResourceApi<TItem, TPage, TInput, TParams> = {
  list: (params: TParams) => Promise<TPage>;
  getById: (id: string) => Promise<TItem>;
  create: (input: TInput) => Promise<TItem>;
  update: (id: string, input: TInput) => Promise<TItem>;
  bulkUpdate: (patch: ResourceBulkUpdate) => Promise<BulkResult>;
  bulkDelete: (ids: string[]) => Promise<BulkResult>;
};

type ResourceApiConfig<TItem, TPage, TParams> = {
  // Например "/secret/categories"
  path: string;
  itemSchema: z.ZodType<TItem>;
  pageSchema: z.ZodType<TPage>;
  // Параметры списка → query-строка запроса
  toSearchParams: (params: TParams) => Record<string, unknown>;
};

// Стандартный CRUD по REST; каждый ответ проверяется zod-схемой
export const createResourceApi = <TItem, TPage, TInput, TParams>({
  path,
  itemSchema,
  pageSchema,
  toSearchParams,
}: ResourceApiConfig<TItem, TPage, TParams>): ResourceApi<TItem, TPage, TInput, TParams> => ({
  list: async (params) => pageSchema.parse((await http.get(path, { params: toSearchParams(params) })).data),
  getById: async (id) => itemSchema.parse((await http.get(`${path}/${id}`)).data),
  create: async (input) => itemSchema.parse((await http.post(path, input)).data),
  update: async (id, input) => itemSchema.parse((await http.patch(`${path}/${id}`, input)).data),
  bulkUpdate: async (patch) => bulkResultSchema.parse((await http.patch(`${path}/bulk`, patch)).data),
  bulkDelete: async (ids) => bulkResultSchema.parse((await http.delete(`${path}/bulk`, { data: { ids } })).data),
});
