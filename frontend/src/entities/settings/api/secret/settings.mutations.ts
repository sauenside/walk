import { useMutation, useQueryClient } from "@tanstack/react-query";
import { secretSettingsApi } from "./settings.api";
import { secretSettingsKeys } from "./settings.keys";

// Сохранение по кнопке: после ответа сервера в кэше — сохранённые настройки
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: secretSettingsApi.update,
    onSuccess: (settings) => queryClient.setQueryData(secretSettingsKeys.all, settings),
  });
};
