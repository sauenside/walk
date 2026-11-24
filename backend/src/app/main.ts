import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppConfigService } from "@/shared/config";
import { requestIdMiddleware, requestLoggerMiddleware } from "@/shared/middlewares";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(AppConfigService);

  app.set("trust proxy", config.trustProxy);

  app.useBodyParser("json", { limit: config.bodyLimit });
  app.useBodyParser("urlencoded", { limit: config.bodyLimit, extended: true });

  app.use(requestIdMiddleware, requestLoggerMiddleware, helmet(), compression(), cookieParser());

  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
    exposedHeaders: ["X-Request-Id"],
  });

  app.enableShutdownHooks();

  await app.listen(config.port);
  new Logger("Bootstrap").log(`server started on port: ${config.port}`);
}

void bootstrap();
