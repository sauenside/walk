import { HttpException } from "@nestjs/common";
import { AppError } from "./app-error";
import { ERROR_CODE_BY_HTTP_STATUS } from "./error-definitions";
import { mapPrismaError } from "./prisma-error.mapper";

const getErrorStatus = (error: unknown) => {
  if (error instanceof HttpException) return error.getStatus();
  if (typeof error === "object" && error !== null && "status" in error && typeof error.status === "number") {
    return error.status;
  }
  return null;
};

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;

  const prismaError = mapPrismaError(error);
  if (prismaError) return prismaError;

  const status = getErrorStatus(error);
  if (status && status < 500) {
    const knownErrorCode = ERROR_CODE_BY_HTTP_STATUS[status];
    return knownErrorCode ? AppError.of(knownErrorCode) : new AppError("BAD_REQUEST", status, "request failed");
  }

  return AppError.internal();
};
