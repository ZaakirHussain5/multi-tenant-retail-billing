import { z } from "zod";

const schema = z.object({
  API_PORT: z.coerce.number().int().positive().default(4000),
  APP_BASE_DOMAIN: z.string().default("localhost"),
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000,http://demo.localhost:3000")
    .transform((value) => value.split(",").map((origin) => origin.trim())),
  DATABASE_URL: z
    .string()
    .default("postgresql://retail:retail@localhost:5432/retail"),
  LOG_LEVEL: z.string().default("info"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  SESSION_SECRET: z
    .string()
    .min(32)
    .default("local-development-session-secret-change-me"),
});

export const env = schema.parse(process.env);
