import { FolderTree } from "lucide-react";
import { MediaThumb, type Media } from "@/entities/media/@x/category";
import type { MediaType } from "../../model/schemas";
import "./category-media.css";

type CategoryMediaProps = {
  mediaType: MediaType;
  emoji: string | null;
  picture: Media | null;
  size?: "sm" | "md" | "lg";
};

const ICON_SIZE = { sm: 15, md: 20, lg: 20 };

// Эмодзи бывают только у категорий; картинку и заглушку рисует общий MediaThumb
export const CategoryMedia = ({ mediaType, emoji, picture, size = "sm" }: CategoryMediaProps) => {
  if (mediaType === "EMOJI" && emoji) {
    return <div className={`category-emoji category-emoji-${size}`}>{emoji}</div>;
  }
  return (
    <MediaThumb
      media={mediaType === "PICTURE" ? picture : null}
      size={size}
      fallback={<FolderTree size={ICON_SIZE[size]} />}
    />
  );
};
