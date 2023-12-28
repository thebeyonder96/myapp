import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Don't accept additional properties to the dto,automatically removed.
    }),
  ); //To use validation pipe in Auth dto
  await app.listen(3000);
}
bootstrap();
