import { z } from "zod";
import { booleanFlagSchema } from "../zod/boolean-flag.schema";
import { formatZodIssues } from "../zod/format-zod-issues";
import { DURATION_PATTERN } from "./duration";

const positiveIntegerSchema = z.coerce.number().int().positive();

const durationSchema = z.string().regex(DURATION_PATTERN, { message: "expected duration, for example: 15m, 12h, 30d" });

const secretSchema = z.string().min(32, { message: "must be at least: 32 characters" });

const originListSchema = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.url()).min(1, { message: "expected at least one url" }));

const bodySizeSchema = z.string().regex(/^\d+(kb|mb)$/, { message: "expected size, for example: 100kb, 1mb" });

const requiredStringSchema = z.string().trim().min(1, { message: "required" });

const publicUrlSchema = z.url().transform((value) => value.replace(/\/+$/, ""));

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: positiveIntegerSchema.default(5000),
    DATABASE_URL: z.string().startsWith("postgres", { message: "expected postgresql connection string" }),
    DATABASE_POOL_MAX: positiveIntegerSchema.default(10),
    BODY_LIMIT: bodySizeSchema.default("1mb"),
    CORS_ORIGINS: originListSchema,
    TRUST_PROXY: booleanFlagSchema.default(false),
    THROTTLE_TTL_MS: positiveIntegerSchema.default(60_000),
    THROTTLE_LIMIT: positiveIntegerSchema.default(100),
    REQUEST_TIMEOUT_MS: positiveIntegerSchema.default(15_000),
    JWT_ACCESS_SECRET: secretSchema,
    JWT_ACCESS_EXPIRES_IN: durationSchema,
    JWT_REFRESH_SECRET: secretSchema,
    JWT_REFRESH_EXPIRES_IN: durationSchema,
    R2_ACCOUNT_ID: z.string().regex(/^[a-f0-9]{32}$/, { message: "expected 32-character cloudflare account id" }),
    R2_ACCESS_KEY_ID: requiredStringSchema,
    R2_SECRET_ACCESS_KEY: requiredStringSchema,
    R2_BUCKET: requiredStringSchema,
    R2_PUBLIC_URL: publicUrlSchema,
    R2_IMAGE_TRANSFORMS: booleanFlagSchema.default(false),
    // Только для разработки, пока нет входа в панель: secret-маршруты открыты без cookie
    AUTH_DISABLED: booleanFlagSchema.default(false),
  })
  .refine(({ NODE_ENV, AUTH_DISABLED }) => !(NODE_ENV === "production" && AUTH_DISABLED), {
    path: ["AUTH_DISABLED"],
    message: "must be false in production",
  });

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (rawEnvironment: Record<string, unknown>): Env => {
  const result = envSchema.safeParse(rawEnvironment);
  if (result.success) return result.data;

  const details = Object.entries(formatZodIssues(result.error.issues, "env"))
    .map(([key, message]) => `${key}: ${message}`)
    .join(", ");
  throw new Error(`invalid environment variables, ${details}`);
};
