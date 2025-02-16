import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { ConfigModule } from './config';
import { ServerType } from './config/types';

async function bootstrap() {
  const configModuleContext = await NestFactory.createApplicationContext(
    ConfigModule,
    { logger: ['log', 'error', 'warn'] },
  );
  const configService = configModuleContext.get(ConfigService);
  const serverType = configService.get('SERVER_TYPE');

  // Initialize Sentry
  Sentry.init({
    dsn: configService.get('SENTRY_DSN'),
    environment: configService.get('ENVIRONMENT'),
  });

  if (serverType === ServerType.WORKER) {
    // For worker, just create the application context without HTTP server
    await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });
    return;
  }

  // For API server, set up the HTTP server with all middleware
  const app = await NestFactory.create(AppModule);

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json());

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(configService.get('PORT'), '::');
}

bootstrap();
