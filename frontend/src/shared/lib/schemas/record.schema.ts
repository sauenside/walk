import { z } from "zod";
import { localizedShape } from "../localized";

// Поля, которые есть у любой записи панели
export const recordShape = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

// Названия обязательны на всех языках, описания необязательны (сервер хранит пустое как null)
export const localizedTextShape = {
  ...localizedShape("name", z.string()),
  ...localizedShape("description", z.string().nullable()),
};
