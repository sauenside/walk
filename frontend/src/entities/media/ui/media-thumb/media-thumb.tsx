import type { ReactNode } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { Media } from "../../model/schemas";
import "./media-thumb.css";

type MediaThumbProps = {
  media: Media | null;
  size?: "sm" | "md" | "lg";
  // Что показать, когда картинки нет; по умолчанию — значок картинки
  fallback?: ReactNode;
};

const ICON_SIZE = { sm: 15, md: 20, lg: 20 };

// Картинка рядом с названием декоративная: alt не нужен, поэтому это фон div, а не img
export const MediaThumb = ({ media, size = "sm", fallback }: MediaThumbProps) => (
  <div
    className={`media-thumb media-thumb-${size}`}
    style={media ? { backgroundImage: `url("${size === "sm" ? media.urls.thumb : media.urls.card}")` } : undefined}
  >
    {!media && (fallback ?? <ImageIcon size={ICON_SIZE[size]} />)}
  </div>
);
