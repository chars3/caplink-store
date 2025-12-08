import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

//controller raiz da aplicação
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  //endpoint raiz para health check
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
