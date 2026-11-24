import { Injectable, type ArgumentMetadata, type PipeTransform } from "@nestjs/common";
import { AppError } from "../errors";
import { formatZodIssues, getZodSchema } from "../zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = getZodSchema(metadata.metatype);
    if (!schema) return value;

    const result = schema.safeParse(value);
    if (!result.success) throw AppError.validation(formatZodIssues(result.error.issues, metadata.type));

    return result.data;
  }
}
