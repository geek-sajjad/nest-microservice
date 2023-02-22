import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { task } from 'src/proto-interfaces/task-proto-interface';
import { CreateTaskRequestDto } from './dtos/create-task-request.dto';
import { UpdateTaskRequestDto } from './dtos/update-task-request.dto';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    @Inject('TASK_PACKAGE') private readonly taskMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.taskServiceClient =
      this.taskMicroservice.getService<task.TaskService>('TaskService');
  }

  private taskServiceClient: task.TaskService;

  async findAll(): Promise<task.Task[]> {
    const observable = this.taskServiceClient.findAll({});
    const { tasks } = await firstValueFrom(observable);

    return tasks;
  }

  findOne(id: string): Observable<task.Task> {
    return this.taskServiceClient.findOne({
      id: id,
    });
  }

  create(createTaskRequestDto: CreateTaskRequestDto): Observable<task.Task> {
    return this.taskServiceClient.create({
      ...createTaskRequestDto,
    });
  }

  delete(id: string): Observable<task.Task> {
    return this.taskServiceClient.deleteOne({
      id: id,
    });
  }

  update(
    id: string,
    updateTaskRequestDto: UpdateTaskRequestDto,
  ): Observable<task.Task> {
    return this.taskServiceClient.updateOne({
      id: id,
      ...updateTaskRequestDto,
    });
  }
}
