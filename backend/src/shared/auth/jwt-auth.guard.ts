import { Injectable, Logger, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { AppConfigService } from "../config";
import { AppError } from "../errors";
import { accessTokenPayloadSchema } from "./access-token-payload";
import { ACCESS_TOKEN_COOKIE } from "./auth-cookies";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly authDisabled: boolean;

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    config: AppConfigService,
  ) {
    this.authDisabled = config.authDisabled;
    if (this.authDisabled) new Logger("Auth").warn("AUTH_DISABLED=true: secret routes are open without a session");
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic || this.authDisabled) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token: unknown = request.cookies?.[ACCESS_TOKEN_COOKIE];
    if (typeof token !== "string" || !token) throw AppError.unauthorized();

    try {
      const payload: unknown = await this.jwtService.verifyAsync(token);
      request.auth = accessTokenPayloadSchema.parse(payload);
      return true;
    } catch {
      throw AppError.unauthorized("session expired or invalid");
    }
  }
}
