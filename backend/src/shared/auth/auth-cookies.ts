import type { CookieOptions, Response } from "express";
import type { AppConfigService } from "../config";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

export const REFRESH_TOKEN_PATH = "/secret/auth";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const baseOptions = (config: AppConfigService): CookieOptions => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "lax",
});

export const setAuthCookies = (response: Response, tokens: AuthTokens, config: AppConfigService) => {
  response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseOptions(config),
    path: "/",
    maxAge: config.jwt.accessMaxAgeMs,
  });
  response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseOptions(config),
    path: REFRESH_TOKEN_PATH,
    maxAge: config.jwt.refreshMaxAgeMs,
  });
};

export const clearAuthCookies = (response: Response, config: AppConfigService) => {
  response.clearCookie(ACCESS_TOKEN_COOKIE, { ...baseOptions(config), path: "/" });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { ...baseOptions(config), path: REFRESH_TOKEN_PATH });
};
