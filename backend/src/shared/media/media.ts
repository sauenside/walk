import { z } from "zod";
import { MediaType } from "../database";
import { idSchema } from "../dto";
import { AppError } from "../errors";

export type Media = {
  mediaType: MediaType;
  pictureId: string | null;
  emoji: string | null;
};

export const mediaShape = {
  mediaType: z.enum(MediaType).optional(),
  pictureId: idSchema.nullable().optional(),
  emoji: z.string().trim().min(1).max(16).nullable().optional(),
};

const mediaRequired = (field: "pictureId" | "emoji", mediaType: MediaType) =>
  AppError.validation({ [field]: `required for media type: "${mediaType}"` });

// Оставляет только поле выбранного типа медиа, остальные обнуляет
export const resolveMedia = ({ mediaType, pictureId, emoji }: Media): Media => {
  switch (mediaType) {
    case MediaType.PICTURE:
      if (!pictureId) throw mediaRequired("pictureId", mediaType);
      return { mediaType, pictureId, emoji: null };
    case MediaType.EMOJI:
      if (!emoji) throw mediaRequired("emoji", mediaType);
      return { mediaType, pictureId: null, emoji };
    default:
      return { mediaType, pictureId: null, emoji: null };
  }
};
