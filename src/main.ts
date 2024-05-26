import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import HttpResponse from 'src/commons/models/HttpResponse';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.enableVersioning();
  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: HttpResponse.transformValidatorError,
    }),
  );

  await app.listen(config.get<string>('appPort'));
}
bootstrap();
