import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      message: 'Volleyball Club Management System is running'
    };
  }
}
