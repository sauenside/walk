import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { durationToMs } from "./duration";
import type { Env } from "./env.schema";

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  private get<K extends keyof Env>(key: K): Env[K] {
    return this.config.get(key, { infer: true });
  }

  get isProduction() {
    return this.get("NODE_ENV") === "production";
  }

  get port() {
    return this.get("PORT");
  }

  get databaseUrl() {
    return this.get("DATABASE_URL");
  }

  get databasePoolMax() {
    return this.get("DATABASE_POOL_MAX");
  }

  get bodyLimit() {
    return this.get("BODY_LIMIT");
  }

  get corsOrigins() {
    return this.get("CORS_ORIGINS");
  }

  get trustProxy() {
    return this.get("TRUST_PROXY");
  }

  get throttle() {
    return { ttlMs: this.get("THROTTLE_TTL_MS"), limit: this.get("THROTTLE_LIMIT") };
  }

  get requestTimeoutMs() {
    return this.get("REQUEST_TIMEOUT_MS");
  }

  get jwt() {
    return {
      accessSecret: this.get("JWT_ACCESS_SECRET"),
      accessExpiresIn: this.get("JWT_ACCESS_EXPIRES_IN"),
      accessMaxAgeMs: durationToMs(this.get("JWT_ACCESS_EXPIRES_IN")),
      refreshSecret: this.get("JWT_REFRESH_SECRET"),
      refreshExpiresIn: this.get("JWT_REFRESH_EXPIRES_IN"),
      refreshMaxAgeMs: durationToMs(this.get("JWT_REFRESH_EXPIRES_IN")),
    };
  }

  get authDisabled() {
    return this.get("AUTH_DISABLED");
  }

  get r2() {
    return {
      accountId: this.get("R2_ACCOUNT_ID"),
      accessKeyId: this.get("R2_ACCESS_KEY_ID"),
      secretAccessKey: this.get("R2_SECRET_ACCESS_KEY"),
      bucket: this.get("R2_BUCKET"),
      publicUrl: this.get("R2_PUBLIC_URL"),
      imageTransforms: this.get("R2_IMAGE_TRANSFORMS"),
    };
  }
}
