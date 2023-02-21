import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices/interfaces';
import { Observable } from 'rxjs';
import { task } from './task';

@Injectable()
export class AppService implements OnModuleInit {
  private tkService: task.TaskService;

  constructor(
    @Inject('TASK_PACKAGE') private readonly taskMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.tkService =
      this.taskMicroservice.getService<task.TaskService>('TaskService');
  }

  callCreateTask(): Observable<task.Task> {
    return this.tkService.create({
      title: 'this is title',
      description: 'this is description',
    });
  }
}
