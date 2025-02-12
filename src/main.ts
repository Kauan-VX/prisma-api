import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // valida atras do DTO os dados recebidos
      forbidNonWhitelisted: true, // Recusa req fora da whiteList( recusa a request toda)
      transform: true, // Transforma os dados recebidos em DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
