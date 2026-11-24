import { useQuery } from "@tanstack/react-query";
import { LANGS, toLang } from "@/shared/config/langs";
import { secretSettingsApi } from "./settings.api";
import { secretSettingsKeys } from "./settings.keys";

export const useSecretSettings = () =>
  useQuery({
    queryKey: secretSettingsKeys.all,
    queryFn: secretSettingsApi.get,
  });

// Включённые языки в порядке LANGS; пока настройки грузятся — все, чтобы ничего не пропустить
export const useEnabledLangs = () => {
  const { data } = useSecretSettings();
  if (!data) return LANGS;
  const enabled = data.enabledLocales.map(toLang);
  return LANGS.filter((lang) => enabled.includes(lang));
};
