import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  /** MongoDB Atlas (primary for auth & app data) */
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  /** Optional PostgreSQL (legacy Prisma features) */
  DATABASE_URL: z.string().optional(),
  /** Optional Redis */
  REDIS_URL: z.string().optional(),
  API_PORT: z.coerce.number().int().positive().default(3001),
  API_GLOBAL_PREFIX: z.string().default('api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32)
    .default('change-me-use-32-chars-minimum-access'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32)
    .default('change-me-use-32-chars-minimum-refresh'),
  JWT_ACCESS_EXPIRES: z.string().default('7d'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    throw new Error(`Invalid environment configuration: ${message}`);
  }
  return parsed.data;
}
