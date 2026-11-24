import { z } from "zod";

// ?ids=a,b и ?ids=a&ids=b дают один и тот же массив
const toList = (value: unknown) =>
  value === undefined
    ? undefined
    : [value]
        .flat()
        .flatMap((item) => String(item).split(","))
        .map((item) => item.trim())
        .filter(Boolean);

export const queryListSchema = <T extends z.ZodType>(item: T, max: number) =>
  z.preprocess(toList, z.array(item).max(max).optional());
