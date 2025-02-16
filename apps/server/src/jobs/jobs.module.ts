import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '~/config';
import { ServerType } from '~/config/types';
import { DatabaseModule } from '~/database/database.module';
import { QUEUES } from './const';
import { UIAuthMiddleware } from './middleware/ui-auth.middleware';

config();
if (process.env.SERVER_TYPE == null)
  throw new Error('SERVER_TYPE env variable is not set');

const QUEUE_CONFIGS = QUEUES.map((name) => ({ name }));
const PRODUCERS = [] as const;
const CONSUMERS = [] as const;

@Module({
  imports: [
    DatabaseModule,
    // BullMQ configs
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
          username: configService.get('REDIS_USERNAME'),
          family: 0,
        },
        defaultJobOptions: {
          removeOnComplete: false,
        },
      }),
      inject: [ConfigService],
    }),
    ...QUEUE_CONFIGS.map((queueConfig) =>
      BullModule.registerQueue(queueConfig),
    ),

    // Bull Board UI configs - only for API server
    ...(process.env.SERVER_TYPE === ServerType.API
      ? [
          BullBoardModule.forRoot({ route: '/jobs', adapter: ExpressAdapter }),
          ...QUEUE_CONFIGS.map((queueConfig) =>
            BullBoardModule.forFeature({
              name: queueConfig.name,
              adapter: BullMQAdapter,
            }),
          ),
        ]
      : []),
  ],
  providers: [
    ...(process.env.SERVER_TYPE === ServerType.API ? PRODUCERS : []),
    ...(process.env.SERVER_TYPE === ServerType.WORKER ? CONSUMERS : []),
  ],
})
export class JobsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UIAuthMiddleware).forRoutes('/jobs');
  }
}
