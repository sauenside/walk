import { http } from "@/shared/api/client";
import type { Locale } from "@/shared/config/langs";
import { clientCategorySchema, type ClientCategory } from "../../model/schemas";

export type ClientCategoryApi = {
  list: (locale: Locale) => Promise<ClientCategory[]>;
};

// Витрина получает всё дерево сразу: для меню каталога подгрузка не нужна
export const clientCategoryApi: ClientCategoryApi = {
  list: async (locale) => {
    const { data } = await http.get("/client/categories", { params: { locale } });
    return clientCategorySchema.array().parse(data);
  },
};
