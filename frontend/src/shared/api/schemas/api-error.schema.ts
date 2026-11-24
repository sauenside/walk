import { isAxiosError } from "axios";
import { z } from "zod";

export const apiErrorSchema = z.object({
  statusCode: z.number().int(),
  code: z.string(),
  message: z.string(),
  fields: z.record(z.string(), z.string()).optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// Тексты по коду ошибки; сущности передают свои коды поверх общих
export type ApiErrorMessages = Partial<Record<string, string>>;

const COMMON_MESSAGES: ApiErrorMessages = {
  BAD_REQUEST: "сервер не принял запрос, обновите страницу и попробуйте ещё раз",
  VALIDATION_ERROR: "проверьте заполнение полей",
  UNAUTHORIZED: "сессия закончилась, войдите заново",
  FORBIDDEN: "недостаточно прав для этого действия",
  ORIGIN_NOT_ALLOWED: "сервер отклонил запрос с этого адреса",
  NOT_FOUND: "запись не найдена, возможно, её уже удалили",
  ROUTE_NOT_FOUND: "сервер не знает такого запроса, возможно, фронт и бэк разных версий",
  CONFLICT: "действие противоречит другим данным",
  REQUEST_TIMEOUT: "сервер не ответил вовремя, попробуйте ещё раз",
  PAYLOAD_TOO_LARGE: "слишком большой запрос",
  TOO_MANY_REQUESTS: "слишком много запросов, подождите минуту",
  INTERNAL_ERROR: "ошибка на сервере, попробуйте позже",
  SERVICE_UNAVAILABLE: "сервер временно недоступен, попробуйте позже",
};

const FALLBACK_MESSAGE = "не удалось выполнить запрос, попробуйте ещё раз";

const NETWORK_MESSAGE = "нет связи с сервером, проверьте интернет и попробуйте ещё раз";

// Ответ API с ошибкой или null, если ошибка не от API
export const parseApiError = (error: unknown): ApiError | null => {
  if (!isAxiosError(error)) return null;
  const parsed = apiErrorSchema.safeParse(error.response?.data);
  return parsed.success ? parsed.data : null;
};

// Текст ошибки для пользователя: по коду из ответа API, из Error или общий
export const getApiErrorMessage = (error: unknown, messages: ApiErrorMessages = {}) => {
  if (isAxiosError(error)) {
    if (!error.response) return NETWORK_MESSAGE;
    const parsed = parseApiError(error);
    return (parsed && (messages[parsed.code] ?? COMMON_MESSAGES[parsed.code])) ?? FALLBACK_MESSAGE;
  }
  if (error instanceof Error && error.message) return error.message;
  return FALLBACK_MESSAGE;
};
