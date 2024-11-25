import 'dotenv/config';
import { devEnvSchema } from '../env-schemas/dev-env-schema';
import { testEnvSchema } from '../env-schemas/test-env-schema';
import { appDockerEnvSchema } from '../env-schemas/docker-env-schema';

export const validateDockerEnvs = () => {
  const parsedEnv = appDockerEnvSchema.safeParse(process.env);
  console.log('parsedEnv', parsedEnv);

  if (!parsedEnv.success) {
    console.error(
      `❌ Invalid Docker environment variables:`,
      parsedEnv.error.format(),
    );
    process.exit(1);
  }
};

export const validateEnv = (environment: 'dev' | 'test') => {
  return (config: Record<string, unknown>): Record<string, unknown> => {
    let envSchema = null;
    switch (environment) {
      case 'dev':
        envSchema = devEnvSchema;
        break;
      case 'test':
        envSchema = testEnvSchema;
        break;
    }

    const parsedEnv = envSchema.safeParse(config);

    if (!parsedEnv.success) {
      console.error(
        `❌ Invalid ${environment} environment variables:`,
        parsedEnv.error.format(),
      );
      process.exit(1); // Exit the application if validation fails
    }

    return parsedEnv.data;
  };
};
