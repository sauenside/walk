// Возвращает новый Set: убирает значение, если оно есть, иначе добавляет
export const toggleInSet = <T,>(set: Set<T>, value: T) => {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
};
