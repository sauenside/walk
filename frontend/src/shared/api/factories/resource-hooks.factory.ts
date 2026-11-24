import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResourceApi, ResourceBulkUpdate } from "./resource-api.factory";
import type { QueryKeys } from "./query-keys.factory";

type ResourceHooksConfig<TItem, TPage, TInput, TQuery, TParams> = {
  keys: QueryKeys<TQuery>;
  api: ResourceApi<TItem, TPage, TInput, TParams>;
  // Запрос из фильтров и сортировки + курсор порции → параметры api.list
  toParams: (query: TQuery, cursor: string | null) => TParams;
};

// Хуки React Query для ресурса: список с подгрузкой по скроллу, одна запись и мутации
export const createResourceHooks = <TItem, TPage extends { nextCursor: string | null }, TInput, TQuery, TParams>({
  keys,
  api,
  toParams,
}: ResourceHooksConfig<TItem, TPage, TInput, TQuery, TParams>) => {
  // Любое изменение затрагивает список, статистику и связанные запросы — сбрасываем весь ресурс
  const useInvalidate = () => {
    const client = useQueryClient();
    return () => client.invalidateQueries({ queryKey: keys.all });
  };

  return {
    useInvalidate,

    useList: (query: TQuery) =>
      useInfiniteQuery({
        queryKey: keys.list(query),
        queryFn: ({ pageParam }) => api.list(toParams(query, pageParam)),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage: TPage) => lastPage.nextCursor,
      }),

    useDetail: (id: string | null) =>
      useQuery({
        queryKey: keys.detail(id ?? ""),
        queryFn: () => api.getById(id as string),
        enabled: id !== null,
      }),

    useCreate: () => {
      const invalidate = useInvalidate();
      return useMutation({ mutationFn: (input: TInput) => api.create(input), onSuccess: invalidate });
    },

    useUpdate: () => {
      const invalidate = useInvalidate();
      return useMutation({
        mutationFn: ({ id, input }: { id: string; input: TInput }) => api.update(id, input),
        onSuccess: invalidate,
      });
    },

    useBulkUpdate: () => {
      const invalidate = useInvalidate();
      return useMutation({ mutationFn: (patch: ResourceBulkUpdate) => api.bulkUpdate(patch), onSuccess: invalidate });
    },

    useBulkDelete: () => {
      const invalidate = useInvalidate();
      return useMutation({ mutationFn: (ids: string[]) => api.bulkDelete(ids), onSuccess: invalidate });
    },
  };
};
