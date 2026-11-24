import type { Provider } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { JwtAuthGuard } from "@/shared/auth";
import { AllExceptionsFilter } from "@/shared/filters/all-exceptions.filter";
import { OriginGuard } from "@/shared/guards";
import { TimeoutInterceptor } from "@/shared/interceptors/timeout.interceptor";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation.pipe";

export const APP_PROVIDERS: Provider[] = [
  { provide: APP_GUARD, useClass: ThrottlerGuard },
  { provide: APP_GUARD, useClass: OriginGuard },
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
  { provide: APP_PIPE, useClass: ZodValidationPipe },
  { provide: APP_FILTER, useClass: AllExceptionsFilter },
];
