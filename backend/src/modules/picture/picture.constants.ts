export const PICTURE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type PictureContentType = keyof typeof PICTURE_EXTENSIONS;

export const PICTURE_CONTENT_TYPES = Object.keys(PICTURE_EXTENSIONS) as [PictureContentType, ...PictureContentType[]];

export const PICTURE_MAX_SIZE = 10 * 1024 * 1024;

export const PICTURE_MAX_DIMENSION = 12_000;

// Ширина в пикселях; без трансформаций (r2.dev) все варианты ведут на оригинал
export const PICTURE_VARIANTS = {
  thumb: 160,
  card: 480,
  full: 1600,
} as const;
