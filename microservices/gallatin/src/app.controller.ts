import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
}
