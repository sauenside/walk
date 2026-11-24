import { Logger } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

const logger = new Logger("Http");

export const requestLoggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const startedAt = performance.now();

  response.on("finish", () => {
    const durationMilliseconds = Math.round(performance.now() - startedAt);
    const line = `${request.method} ${request.originalUrl} ${response.statusCode} ${durationMilliseconds}ms, request: ${request.id}`;

    if (response.statusCode >= 500) logger.error(line);
    else if (response.statusCode >= 400) logger.warn(line);
    else logger.log(line);
  });

  next();
};
