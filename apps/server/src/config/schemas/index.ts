import { z } from 'zod';
import { Environment } from '../types';
import { databaseConfigSchema } from './database';

export const configSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    ENVIRONMENT: z
      .enum([
        Environment.Development,
        Environment.Staging,
        Environment.Production,
      ])
      .default(Environment.Development),
    APP_URL: z.string(),
    PORT: z.coerce.number().int().positive().default(3000),
    SYSTEM_SECRET: z.string(),
    SENTRY_DSN: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().int().positive(),
    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
  })
  .merge(databaseConfigSchema)
  .strip();

export type Config = z.infer<typeof configSchema>;

export { databaseConfigSchema };
