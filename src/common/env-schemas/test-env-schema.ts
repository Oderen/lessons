import { z } from 'zod';

export const testEnvSchema = z.object({
  ACCESS_JWT_SECRET: z.string(),
  ACCESS_JWT_EXPIRES_IN: z.string(),
  REFRESH_JWT_SECRET: z.string(),
  REFRESH_JWT_EXPIRES_IN: z.string(),
});
