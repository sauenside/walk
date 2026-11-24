import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from "@nestjs/common";
import { TimeoutError, catchError, throwError, timeout } from "rxjs";
import { AppConfigService } from "../config";
import { AppError } from "../errors";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly config: AppConfigService) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(this.config.requestTimeoutMs),
      catchError((error: unknown) =>
        throwError(() => (error instanceof TimeoutError ? AppError.requestTimeout() : error)),
      ),
    );
  }
}
