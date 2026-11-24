// Копия объекта только с нужными полями: pick(category, ["id", "nameRu"]) → { id, nameRu }
export const pick = <T extends object, K extends keyof T>(source: T, keys: readonly K[]) =>
  Object.fromEntries(keys.map((key) => [key, source[key]])) as Pick<T, K>;
