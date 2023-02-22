import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TaskService } from '../services/task.service';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  // TODO refactor UserController and Grpc Methods
  @GrpcMethod('TaskService', 'Create')
  async create(data: any) {
    console.log(data);
    const task = await this.taskService.create({
      title: data.title,
      description: data.description,
    });

    return task;
  }

  @GrpcMethod('TaskService', 'FindOne')
  findOne() {
    console.log('finding task....');
    return {
      id: 'sdfdf',
      title: 'sfsfsf',
      description: 'dfdfgd',
    };
  }

  @GrpcMethod('TaskService', 'FindAll')
  findAll() {
    console.log('finding all task....');
    return {
      tasks: [
        {
          id: 'sdfdf',
          title: 'sfsfsf',
          description: 'dfdfgd',
        },
        {
          id: 'sdfdf',
          title: 'sfsfsf',
          description: 'dfdfgd',
        },
      ],
    };
  }

  @GrpcMethod('TaskService', 'UpdateOne')
  update() {
    console.log('updating task....');
    return {
      id: 'sdfdf',
      title: 'sfsfsf',
      description: 'dfdfgd',
    };
  }

  @GrpcMethod('TaskService', 'DeleteOne')
  delete() {
    console.log('deleting task....');
    return {
      id: 'sdfdf',
      title: 'sfsfsf',
      description: 'dfdfgd',
    };
  }
}
