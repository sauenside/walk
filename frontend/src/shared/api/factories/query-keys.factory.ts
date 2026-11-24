// Ключи кэша React Query для одного ресурса: после любого изменения достаточно сбросить keys.all
export const createQueryKeys = <TQuery>(scope: "secret" | "client", resource: string) => {
  const all = [scope, resource] as const;

  return {
    all,
    list: (query: TQuery) => [...all, "list", query] as const,
    detail: (id: string) => [...all, "detail", id] as const,
    // Свои запросы ресурса, например metrics или roots у категорий
    extra: (name: string, ...args: unknown[]) => [...all, name, ...args] as const,
  };
};

export type QueryKeys<TQuery> = ReturnType<typeof createQueryKeys<TQuery>>;
