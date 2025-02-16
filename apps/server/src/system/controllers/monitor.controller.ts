import { Controller, Get } from '@nestjs/common';
import { Public } from '~/commons/decorators/public.decorator';

@Controller('system/monitor')
export class MonitorController {
  @Public()
  @Get('health')
  async getHealth() {
    return { status: 'OK' };
  }
}
