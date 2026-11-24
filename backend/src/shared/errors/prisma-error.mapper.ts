import { Prisma } from "../database/generated/client";
import { AppError } from "./app-error";

export const mapPrismaError = (error: unknown): AppError | null => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;

  switch (error.code) {
    case "P2002": {
      const target = error.meta?.target;
      const fields = Array.isArray(target) ? target.join(", ") : typeof target === "string" ? target : "";
      return AppError.conflict(fields ? `record already exists, unique fields: ${fields}` : "record already exists");
    }
    case "P2025":
      return AppError.notFound();
    case "P2003":
      return AppError.conflict("related records prevent this action");
    default:
      return null;
  }
};
