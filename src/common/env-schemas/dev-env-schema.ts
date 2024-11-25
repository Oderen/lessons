import { z } from 'zod';

export const devEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0),
  ACCESS_JWT_SECRET: z.string(),
  ACCESS_JWT_EXPIRES_IN: z.string(),
  REFRESH_JWT_SECRET: z.string(),
  REFRESH_JWT_EXPIRES_IN: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_USERNAME: z.string(),
  DB_PORT: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0),
  DB_HOST: z.string(),
});

export type EnvVars = z.infer<typeof devEnvSchema>;
