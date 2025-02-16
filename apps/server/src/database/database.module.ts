import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entitiesToReigster } from './entities-registry';
import { AllMigrations } from './services/all-migrations';

@Module({
  imports: [TypeOrmModule.forFeature(entitiesToReigster)],
  exports: [TypeOrmModule],
  providers: [AllMigrations],
})
export class DatabaseModule {}
