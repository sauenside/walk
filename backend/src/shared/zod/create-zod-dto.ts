import type { z } from "zod";

export const ZOD_SCHEMA = Symbol("zodSchema");

export type ZodDto<T extends z.ZodType> = {
  new (): z.infer<T>;
  readonly [ZOD_SCHEMA]: T;
};

export const createZodDto = <T extends z.ZodType>(schema: T): ZodDto<T> => {
  class ZodDtoClass {
    static readonly [ZOD_SCHEMA] = schema;
  }
  return ZodDtoClass as unknown as ZodDto<T>;
};

export const getZodSchema = (metatype: unknown): z.ZodType | null =>
  typeof metatype === "function" && ZOD_SCHEMA in metatype ? (metatype as ZodDto<z.ZodType>)[ZOD_SCHEMA] : null;
