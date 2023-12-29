import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('My API')
    .setVersion('1.0')
    .addServer('http://localhost:3000/')
    .addTag('My tag')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Don't accept additional properties to the dto,automatically removed.
    }),
  ); //To use validation pipe in Auth dto
  await app.listen(3000);
}
bootstrap();
