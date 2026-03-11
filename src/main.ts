import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { Transport } from '@nestjs/microservices';
import * as mongoose from 'mongoose';

// ────────────────────────────────────────────────────────────────────────────
// Global ObjectId cast override
// Some legacy documents may store ObjectId-typed fields as empty strings ("").
// Without this guard, Mongoose's populate throws a CastError when it builds
// the secondary lookup:  Model.find({ _id: { $in: [""] } })
// By returning null for falsy/empty values we let populate skip those refs
// gracefully instead of crashing the entire request.
// ────────────────────────────────────────────────────────────────────────────
const _originalObjectIdCast = (mongoose.Schema.Types.ObjectId as any).cast();
(mongoose.Schema.Types.ObjectId as any).cast((v: any) => {
  if (v === null || v === undefined || v === '') return null;
  return _originalObjectIdCast(v);
});

import { AppModule } from './app.module';
import { AppConfigService } from './common/config/app-config.service';
import { logStartup } from './common/logs/log-startup.log';
import { LoggingInterceptor } from './common/interceptors';
import { WinstonService } from './shared/Wiston/winston.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig = app.get(AppConfigService);
  const winstonService = app.get(WinstonService);

  ////////////////////////////////////////////////////////////////////////////////
  //                               GLOBAL INTERCEPTORS & FILTERS
  ////////////////////////////////////////////////////////////////////////////////
  app.useGlobalInterceptors(new LoggingInterceptor(winstonService));
  app.useGlobalFilters(new AllExceptionsFilter(winstonService));

  ////////////////////////////////////////////////////////////////////////////////
  //                               CORS
  ////////////////////////////////////////////////////////////////////////////////
  app.enableCors({
    origin: appConfig.getCorsOrigins(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  ////////////////////////////////////////////////////////////////////////////////
  //                               BODY PARSER
  ////////////////////////////////////////////////////////////////////////////////
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  ////////////////////////////////////////////////////////////////////////////////
  //                               VALIDATION
  ////////////////////////////////////////////////////////////////////////////////
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  ////////////////////////////////////////////////////////////////////////////////
  //                               MICROSERVICE
  ////////////////////////////////////////////////////////////////////////////////
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: AppModule.serverIP,
        port: appConfig.getMicroservicePort(),
        retryAttempts: 3,
        retryDelay: 100,
      },
    },
    { inheritAppConfig: true },
  );

  ////////////////////////////////////////////////////////////////////////////////
  //                               SWAGGER
  ////////////////////////////////////////////////////////////////////////////////
  const document = new DocumentBuilder()
    .setTitle('DTS Logic Backend')
    .setDescription('DTS Logic Backend APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, document );
  const swaggerPath = '/apis';
  SwaggerModule.setup(swaggerPath, app, swaggerDoc, { swaggerOptions: { filter: true } });
  SwaggerModule.setup(swaggerPath, app, swaggerDoc);

  ////////////////////////////////////////////////////////////////////////////////
  //                               START
  ////////////////////////////////////////////////////////////////////////////////
  const port = appConfig.getRunningPort();

  await app.startAllMicroservices();
  await app.listen(port);

  logStartup(appConfig, port, swaggerPath);
}

bootstrap();