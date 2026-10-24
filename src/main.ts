import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = configureApp(await NestFactory.create(AppModule));
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3000));
}
bootstrap();
