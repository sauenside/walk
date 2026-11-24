import { HttpStatus } from "@nestjs/common";
import { ERROR_DEFINITIONS, type ErrorCode } from "./error-definitions";

type FieldErrors = Record<string, string>;

export class AppError extends Error {
  constructor(
    readonly code: string,
    readonly statusCode: number,
    message: string,
    readonly fields?: FieldErrors,
  ) {
    super(message);
    this.name = "AppError";
  }

  static of(code: ErrorCode, message?: string, fields?: FieldErrors) {
    const definition = ERROR_DEFINITIONS[code];
    return new AppError(code, definition.status, message ?? definition.message, fields);
  }

  static validation(fields: FieldErrors) {
    return AppError.of("VALIDATION_ERROR", undefined, fields);
  }

  static unauthorized(message?: string) {
    return AppError.of("UNAUTHORIZED", message);
  }

  static originNotAllowed() {
    return AppError.of("ORIGIN_NOT_ALLOWED");
  }

  static notFound(message?: string, code = "NOT_FOUND", fields?: FieldErrors) {
    return new AppError(code, HttpStatus.NOT_FOUND, message ?? ERROR_DEFINITIONS.NOT_FOUND.message, fields);
  }

  static conflict(message: string, code = "CONFLICT", fields?: FieldErrors) {
    return new AppError(code, HttpStatus.CONFLICT, message, fields);
  }

  static requestTimeout() {
    return AppError.of("REQUEST_TIMEOUT");
  }

  static internal() {
    return AppError.of("INTERNAL_ERROR");
  }

  static serviceUnavailable(message?: string) {
    return AppError.of("SERVICE_UNAVAILABLE", message);
  }
}
