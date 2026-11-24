// TanStack Form хранит ошибки zod как объекты { message }; полю нужна первая строка
export const fieldError = (errors: ReadonlyArray<unknown>) => {
  const first = errors.find(Boolean);
  if (!first) return undefined;
  if (typeof first === "string") return first;
  if (typeof first === "object" && "message" in first) return String(first.message);
  return undefined;
};
