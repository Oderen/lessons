import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common/utils/swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = Number.parseInt(process.env.PORT);
  const isProductionEnv = process.env.NODE_ENV === 'production';

  if (!isProductionEnv) {
    setupSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);

  const appUrl = await app.getUrl();
  console.log(
    `Application started:\n- Port: ${appUrl}\n- Docs: ${appUrl}/docs`,
  );
}
bootstrap();
