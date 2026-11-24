import { z } from "zod";
import { idSchema } from "./id-param.dto";

export const idListSchema = z
  .array(idSchema)
  .min(1)
  .max(100)
  .transform((ids) => [...new Set(ids)]);
