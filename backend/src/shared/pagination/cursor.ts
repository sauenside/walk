import { z } from "zod";
import { AppError } from "../errors";

const cursorSchema = z.object({ offset: z.number().int().min(0) });

export type Cursor = z.infer<typeof cursorSchema>;

export const encodeCursor = (cursor: Cursor) => Buffer.from(JSON.stringify(cursor)).toString("base64url");

export const decodeCursor = (value: string | null | undefined): Cursor => {
  if (!value) return { offset: 0 };
  try {
    return cursorSchema.parse(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
  } catch {
    throw AppError.validation({ cursor: "invalid cursor" });
  }
};
