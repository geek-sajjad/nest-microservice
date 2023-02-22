import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class UserController {
  // TODO refactor UserController and Grpc Methods
  @GrpcMethod('TaskService', 'Create')
  create(data: any) {
    console.log(data);
    console.log('creating task....');
    return {
      id: 'sdfdf',
      title: 'sfsfsf',
      description: 'dfdfgd',
    };
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
