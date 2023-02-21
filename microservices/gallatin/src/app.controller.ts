import { Controller, Get } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  @GrpcMethod('TaskService', 'Create')
  create() {
    console.log('creating task....');
    return {
      id: 23,
      title: 'sfsfsf',
      description: 'dfdfgd',
    };
  }

  @GrpcMethod('TaskService', 'FindOne')
  findOne() {
    console.log('finding task....');
  }

  @GrpcMethod('TaskService', 'FindAll')
  findAll() {
    console.log('finding all task....');
  }

  @GrpcMethod('TaskService', 'Update')
  update() {
    console.log('updating task....');
  }

  @GrpcMethod('TaskService', 'Delete')
  delete() {
    console.log('deleting task....');
  }
}
