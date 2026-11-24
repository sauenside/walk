import { z } from "zod";

// Один файл в трёх размерах по ширине: thumb — значок в списке, card — карточка, full — крупный просмотр
export const mediaSchema = z.object({
  id: z.string(),
  urls: z.object({
    thumb: z.string(),
    card: z.string(),
    full: z.string(),
  }),
  width: z.number().int(),
  height: z.number().int(),
});

export type Media = z.infer<typeof mediaSchema>;
