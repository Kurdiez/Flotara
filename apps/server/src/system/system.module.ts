import { Module } from '@nestjs/common';
import { DatabaseModule } from '~/database/database.module';
import { UserManagementModule } from '~/user-management/user-management.module';
import { MonitorController } from './controllers/monitor.controller';

@Module({
  imports: [DatabaseModule, UserManagementModule],
  controllers: [MonitorController],
  providers: [],
})
export class SystemModule {}
