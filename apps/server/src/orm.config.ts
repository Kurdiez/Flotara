import { config } from 'dotenv';
config();

import { DataSource } from 'typeorm';
import { databaseConfigSchema } from './config';

const db = databaseConfigSchema.parse(process.env);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: db.DATABASE_HOST,
  port: db.DATABASE_PORT,
  username: db.DATABASE_USER,
  password: db.DATABASE_PASSWORD,
  database: db.DATABASE_NAME,

  entities: [__dirname + '/database/entities/**/*.ts'],
  migrations: [__dirname + '/database/migrations/db/**/*.ts'],

  synchronize: false,
});

export default AppDataSource;
