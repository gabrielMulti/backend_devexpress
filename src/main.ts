import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  dotenv.config();

  app.setGlobalPrefix(`v${process.env.SVERSIONURL}`);


  //Adicionando Swagger
  const config = new DocumentBuilder()
    .setTitle(process.env.STITLE)
    .setDescription(process.env.SDESCRIPTION)
    .addServer(`${process.env.SHOST}`)
    .setVersion(process.env.SVERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`docs`, app, document);

  console.log(`running in: http://localhost:${process.env.PORT}/v${process.env.SVERSIONURL}`)

  await app.listen(process.env.PORT);
}
bootstrap();
