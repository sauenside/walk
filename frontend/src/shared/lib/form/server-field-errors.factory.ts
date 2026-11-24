import { parseApiError } from "@/shared/api/schemas";

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

type ServerFieldErrorsConfig<Field extends string> = {
  // Поле API → поле формы, например pictureId → picture; поля, которых нет в форме, пропускаются
  fields: Partial<Record<string, Field>>;
  // Текст для поля, если сервер его отклонил
  fieldMessages?: FieldErrors<Field>;
  // Свой текст для поля при конкретном коде ошибки, например SLUG_TAKEN → slug
  codeMessages?: Partial<Record<string, FieldErrors<Field>>>;
};

const FALLBACK_MESSAGE = "проверьте значение";

// Ошибки полей из ответа API в виде { поле формы: текст на русском }
export const createServerFieldErrors =
  <Field extends string>({ fields, fieldMessages = {}, codeMessages = {} }: ServerFieldErrorsConfig<Field>) =>
  (error: unknown): FieldErrors<Field> => {
    const apiError = parseApiError(error);
    const result: FieldErrors<Field> = {};
    if (!apiError?.fields) return result;
    for (const key of Object.keys(apiError.fields)) {
      const field = fields[key];
      if (!field) continue;
      result[field] = codeMessages[apiError.code]?.[field] ?? fieldMessages[field] ?? FALLBACK_MESSAGE;
    }
    return result;
  };

// Поля, которые в API и в форме называются одинаково
export const sameFields = <Field extends string>(keys: readonly Field[]) =>
  Object.fromEntries(keys.map((key) => [key, key])) as Record<Field, Field>;
