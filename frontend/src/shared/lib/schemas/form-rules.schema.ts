import { z } from "zod";
import { SLUG_MAX_LENGTH, SLUG_PATTERN } from "../slug";

// Тексты правил полей. Их же показываем, когда то же поле отклоняет сервер — второй раз не пишем
export const RULE_MESSAGES = {
  nameRequired: "введите название",
  nameTooLong: "не длиннее 100 символов",
  descriptionTooLong: "не длиннее 1000 символов",
  slugRequired: "введите адрес",
  slugTooLong: `не длиннее ${SLUG_MAX_LENGTH} символов`,
  slugPattern: "только латиница в нижнем регистре, цифры и дефис между словами",
  position: "позиция: целое число от 1",
} as const;

// Правила полей формы; совпадают с проверками сервера

// Пустое допустимо: название обязательно только на включённых языках сайта, это проверяет форма
export const nameRule = z.string().trim().max(100, RULE_MESSAGES.nameTooLong);

export const descriptionRule = z.string().max(1000, RULE_MESSAGES.descriptionTooLong);

export const slugRule = z
  .string()
  .trim()
  .min(1, RULE_MESSAGES.slugRequired)
  .max(SLUG_MAX_LENGTH, RULE_MESSAGES.slugTooLong)
  .regex(SLUG_PATTERN, RULE_MESSAGES.slugPattern);

export const positionRule = z.number().int(RULE_MESSAGES.position).min(1, RULE_MESSAGES.position);
