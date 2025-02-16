import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const isCloudRun = process.env.K_SERVICE !== undefined;

export const createDBConnectionImport = () =>
  TypeOrmModule.forRootAsync({
    name: 'default',
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USER'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      extra: isCloudRun
        ? {
            socketPath: `/cloudsql/${configService.get('INSTANCE_CONNECTION_NAME')}`,
          }
        : {
            driver: { family: 4 },
          },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + 'db/migrations/**/*{.ts,.js}'],
      synchronize: false,
    }),
    imports: [ConfigModule],
    inject: [ConfigService],
  });

export const databaseConnections = [createDBConnectionImport()];
