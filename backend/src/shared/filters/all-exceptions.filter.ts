import { Catch, Logger, type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import type { Request, Response } from "express";
import { toAppError } from "../errors";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("Exceptions");

  catch(exception: unknown, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const error = toAppError(exception);

    if (error.statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.originalUrl}, request: ${request.id}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      ...(error.fields && { fields: error.fields }),
    });
  }
}
