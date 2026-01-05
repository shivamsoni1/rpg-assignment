import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5177', // frontend dev URL (adjust if different)
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 3200);
}
bootstrap();
