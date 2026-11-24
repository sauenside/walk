import { z } from "zod";

// Пустое допустимо: обязательность по включённым языкам сайта проверяет сервис
export const nameSchema = z.string().trim().max(100);

export const descriptionSchema = z
  .string()
  .trim()
  .max(1000)
  .nullable()
  .optional()
  .transform((value) => (value === "" ? null : value));

export const searchSchema = z
  .string()
  .trim()
  .max(100)
  .optional()
  .transform((value) => value || undefined);
