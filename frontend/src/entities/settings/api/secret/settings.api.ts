import { http } from "@/shared/api/client";
import { settingsSchema, type Settings, type SettingsInput } from "../../model/settings.schema";

export const secretSettingsApi = {
  get: async (): Promise<Settings> => settingsSchema.parse((await http.get("/secret/settings")).data),
  update: async (input: SettingsInput): Promise<Settings> =>
    settingsSchema.parse((await http.patch("/secret/settings", input)).data),
};
