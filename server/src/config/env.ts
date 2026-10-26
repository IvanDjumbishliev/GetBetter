import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.url().default(process.env.CLIENT_URL || 'http://localhost:5173'),
  REDIS_URL: z.url().optional(),
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
});

// Treat empty strings (e.g. copied straight from .env.example) as unset so defaults apply.
const raw = Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== ''));

const parsed = envSchema.safeParse(raw);

if (!parsed.success) {
  console.error('Invalid environment variables:', z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

if (parsed.data.ACCESS_TOKEN_SECRET === parsed.data.REFRESH_TOKEN_SECRET) {
  console.error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different.');
  process.exit(1);
}

export const env = parsed.data;
