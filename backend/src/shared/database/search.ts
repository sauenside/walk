type ContainsFilter = { contains: string; mode: "insensitive" };

// Prisma-условие: хотя бы одно поле содержит строку без учёта регистра
export const containsAny = <Field extends string>(fields: readonly Field[], search?: string) =>
  search
    ? { OR: fields.map((field) => ({ [field]: { contains: search, mode: "insensitive" } }) as Record<Field, ContainsFilter>) }
    : {};

// То же условие для записей, уже загруженных в память
export const matchesAny = <Field extends string>(
  record: Record<Field, string | null>,
  fields: readonly Field[],
  search: string,
) => {
  const query = search.toLowerCase();
  return fields.some((field) => record[field]?.toLowerCase().includes(query));
};
