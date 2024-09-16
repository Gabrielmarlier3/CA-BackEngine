import { Controller, Get } from '@nestjs/common';

@Controller('appService')
export class AppController {
  constructor() {}

  @Get('test')
  test(): string {
    return 'ok'
  }
}
