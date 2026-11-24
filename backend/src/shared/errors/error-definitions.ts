import { HttpStatus } from "@nestjs/common";

export const ERROR_DEFINITIONS = {
  BAD_REQUEST: { status: HttpStatus.BAD_REQUEST, message: "bad request" },
  VALIDATION_ERROR: { status: HttpStatus.BAD_REQUEST, message: "validation failed" },
  UNAUTHORIZED: { status: HttpStatus.UNAUTHORIZED, message: "authentication required" },
  FORBIDDEN: { status: HttpStatus.FORBIDDEN, message: "access denied" },
  ORIGIN_NOT_ALLOWED: { status: HttpStatus.FORBIDDEN, message: "origin not allowed" },
  NOT_FOUND: { status: HttpStatus.NOT_FOUND, message: "record not found" },
  ROUTE_NOT_FOUND: { status: HttpStatus.NOT_FOUND, message: "route not found" },
  METHOD_NOT_ALLOWED: { status: HttpStatus.METHOD_NOT_ALLOWED, message: "method not allowed" },
  REQUEST_TIMEOUT: { status: HttpStatus.REQUEST_TIMEOUT, message: "request timed out" },
  CONFLICT: { status: HttpStatus.CONFLICT, message: "record conflict" },
  PAYLOAD_TOO_LARGE: { status: HttpStatus.PAYLOAD_TOO_LARGE, message: "payload too large" },
  TOO_MANY_REQUESTS: { status: HttpStatus.TOO_MANY_REQUESTS, message: "too many requests, try again later" },
  INTERNAL_ERROR: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "internal server error" },
  SERVICE_UNAVAILABLE: { status: HttpStatus.SERVICE_UNAVAILABLE, message: "service unavailable" },
} as const satisfies Record<string, { status: HttpStatus; message: string }>;

export type ErrorCode = keyof typeof ERROR_DEFINITIONS;

export const ERROR_CODE_BY_HTTP_STATUS: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: "BAD_REQUEST",
  [HttpStatus.UNAUTHORIZED]: "UNAUTHORIZED",
  [HttpStatus.FORBIDDEN]: "FORBIDDEN",
  [HttpStatus.NOT_FOUND]: "ROUTE_NOT_FOUND",
  [HttpStatus.METHOD_NOT_ALLOWED]: "METHOD_NOT_ALLOWED",
  [HttpStatus.REQUEST_TIMEOUT]: "REQUEST_TIMEOUT",
  [HttpStatus.PAYLOAD_TOO_LARGE]: "PAYLOAD_TOO_LARGE",
  [HttpStatus.TOO_MANY_REQUESTS]: "TOO_MANY_REQUESTS",
};
