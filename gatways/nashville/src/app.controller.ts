import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/task')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/create')
  create() {
    return this.appService.callCreateTask();
  }

  @Get('/update')
  update() {
    console.log('calling update');
  }

  @Get('/delete')
  delete() {
    console.log('calling delete');
  }

  @Get('/findOne')
  findOne() {
    console.log('calling findOne');
  }
}
