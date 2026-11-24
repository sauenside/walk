"use client";

import { useState, type ReactNode } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/shared/api/schemas";
import { toast } from "@/shared/ui/overlays/toast";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  // Один клиент на вкладку: создаётся при первом рендере и не пересоздаётся
  const [client] = useState(
    () =>
      new QueryClient({
        // Загрузка не удалась даже после повторов — сообщаем. Одинаковые ошибки сливаются в одно уведомление:
        // сервер лёг — упадут и список, и метрики, а сказать об этом нужно один раз
        queryCache: new QueryCache({
          onError: (error) => {
            const message = getApiErrorMessage(error);
            toast.error("не удалось загрузить данные", { id: `query-error:${message}`, text: message });
          },
        }),
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
