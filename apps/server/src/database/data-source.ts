import 'dotenv/config';
import { DataSource } from 'typeorm';

const isCloudRun = process.env.K_SERVICE !== undefined;

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  extra: isCloudRun
    ? {
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      }
    : {
        driver: { family: 4 },
      },
  entities: ['src/database/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/db/*{.ts,.js}'],
  synchronize: false,

  logging: true,
});

export default dataSource;
