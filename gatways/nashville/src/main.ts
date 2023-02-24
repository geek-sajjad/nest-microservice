import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ExceptionFilter } from './exceptions/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // app.useGlobalFilters(new ExceptionFilter());
  await app.listen(3000);
}
bootstrap();
