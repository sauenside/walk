import type { ApiErrorMessages } from "@/shared/api/schemas";

// Форматы и лимит совпадают с сервером. Все тексты про них собираются отсюда
export const MEDIA_FORMATS = [
  { mime: "image/png", label: "PNG" },
  { mime: "image/jpeg", label: "JPG" },
  { mime: "image/webp", label: "WebP" },
] as const;

export const MEDIA_ACCEPT: readonly string[] = MEDIA_FORMATS.map((format) => format.mime);

export const MEDIA_MAX_SIZE_MB = 10;

export const MEDIA_MAX_SIZE = MEDIA_MAX_SIZE_MB * 1024 * 1024;

const labels = MEDIA_FORMATS.map((format) => format.label);

// «PNG, JPG или WebP»
export const MEDIA_FORMATS_TEXT = `${labels.slice(0, -1).join(", ")} или ${labels[labels.length - 1]}`;

// «PNG, JPG или WebP до 10 МБ»
export const MEDIA_REQUIREMENTS = `${MEDIA_FORMATS_TEXT} до ${MEDIA_MAX_SIZE_MB} МБ`;

export const MEDIA_ERROR_MESSAGES: ApiErrorMessages = {
  VALIDATION_ERROR: `файл не подходит: нужен ${MEDIA_REQUIREMENTS}`,
  PICTURE_NOT_UPLOADED: "файл не дошёл до хранилища, попробуйте ещё раз",
  PICTURE_INVALID_UPLOAD: `загруженный файл не совпал с выбранным: проверьте формат и размер до ${MEDIA_MAX_SIZE_MB} МБ`,
};
