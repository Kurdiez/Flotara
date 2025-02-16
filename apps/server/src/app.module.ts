import { Module } from '@nestjs/common';
import { ConfigModule as NestjsConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryInterceptor } from '~/commons/error-handlers/sentry-interceptor';
import { ConfigModule, configSchema } from '~/config';
import { databaseConnections } from '~/database/connections';
import { DatabaseModule } from '~/database/database.module';
import { SystemModule } from '~/system/system.module';
import { AppController } from './app.controller';
import { JobsModule } from './jobs/jobs.module';
import { SystemGuard } from './system/auth/system.guard';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [
    NestjsConfigModule.forRoot({
      validate: (env) => configSchema.parse(env),
      expandVariables: false,
    }),
    ConfigModule,
    ScheduleModule.forRoot(),
    ...databaseConnections,
    DatabaseModule,
    SystemModule,
    UserManagementModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
    { provide: APP_GUARD, useClass: SystemGuard },
  ],
})
export class AppModule {}
