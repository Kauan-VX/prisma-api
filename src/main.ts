import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedInterceptor } from './common/errors/interceptors/unauthorized.interceptor';
import { ConflictInterceptor } from './common/errors/interceptors/conflict.interceptor';
import { DatabaseInterceptor } from './common/errors/interceptors/database.interceptor';
import { NotFoundInterceptor } from './common/errors/interceptors/notfound.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // valida atras do DTO os dados recebidos
      forbidNonWhitelisted: true, // Recusa req fora da whiteList( recusa a request toda)
      transform: true, // Transforma os dados recebidos em DTO
    }),
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ConflictInterceptor());
  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.useGlobalInterceptors(new NotFoundInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
