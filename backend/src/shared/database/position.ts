export const POSITION_ASC = { position: "asc" } as const;

// Позиции начинаются с 1: так их видит и вводит человек в панели
export const toNextPosition = (maxPosition: number | null | undefined) => (maxPosition ?? 0) + 1;
