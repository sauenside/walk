import { z } from "zod";
import { http } from "@/shared/api/client";
import { mediaSchema, type Media } from "../../model/schemas";

export type SecretMediaApi = {
  upload: (file: File) => Promise<Media>;
};

const uploadTicketSchema = z.object({
  picture: z.object({ id: z.string() }),
  upload: z.object({
    url: z.string(),
    method: z.literal("PUT"),
    headers: z.record(z.string(), z.string()),
  }),
});

const PATH = "/secret/pictures";

const readDimensions = async (file: File) => {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    throw new Error("не удалось прочитать картинку, попробуйте другой файл");
  }
};

// Файл идёт в хранилище напрямую по подписанной ссылке, сервер только выдаёт ссылку и проверяет результат
export const secretMediaApi: SecretMediaApi = {
  upload: async (file) => {
    const { width, height } = await readDimensions(file);

    const ticket = uploadTicketSchema.parse(
      (await http.post(PATH, { contentType: file.type, size: file.size, width, height })).data,
    );

    const response = await fetch(ticket.upload.url, {
      method: ticket.upload.method,
      headers: ticket.upload.headers,
      body: file,
    }).catch(() => null);
    if (!response?.ok) throw new Error("не удалось загрузить файл в хранилище, попробуйте ещё раз");

    return mediaSchema.parse((await http.post(`${PATH}/${ticket.picture.id}/confirm`)).data);
  },
};
