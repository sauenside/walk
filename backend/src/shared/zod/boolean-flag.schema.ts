import { z } from "zod";

export const booleanFlagSchema = z.enum(["true", "false"]).transform((value) => value === "true");
