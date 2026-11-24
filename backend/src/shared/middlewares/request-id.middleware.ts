import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const REQUEST_ID_HEADER = "X-Request-Id";

const SAFE_REQUEST_ID_PATTERN = /^[\w-]{8,64}$/;

export const requestIdMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const incomingRequestId = request.header(REQUEST_ID_HEADER);
  request.id =
    incomingRequestId && SAFE_REQUEST_ID_PATTERN.test(incomingRequestId) ? incomingRequestId : randomUUID();
  response.setHeader(REQUEST_ID_HEADER, request.id);
  next();
};
