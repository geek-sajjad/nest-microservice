import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { task } from 'src/proto-interfaces/task-proto-interface';
import { TaskCreateRequestDto } from './dtos/task-create-request.dto';
import { TaskUpdateRequestDto } from './dtos/task-update-request.dto';

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

  async findAll(query: any): Promise<any> {
    const observable = this.taskServiceClient.findAll({
      findAllRequestQueryParam: {
        ...query,
      },
    });
    const res = await firstValueFrom(observable);
    return res;
  }

  async findOne(id: string): Promise<task.Task> {
    const observable = this.taskServiceClient.findOne({
      id: id,
    });

    try {
      const res = await firstValueFrom(observable);
      return res;
    } catch (_) {
      throw new NotFoundException('task not found');
    }
  }

  async findOneWithParent(id: string): Promise<task.Task> {
    const observable = this.taskServiceClient.findOneWithParent({
      id: id,
    });

    try {
      const res = await firstValueFrom(observable);
      return res;
    } catch (_) {
      throw new NotFoundException('task not found');
    }
  }

  async findOneWithChild(id: string): Promise<task.Task> {
    const observable = this.taskServiceClient.findOneWithChild({
      id: id,
    });

    try {
      const res = await firstValueFrom(observable);
      return res;
    } catch (_) {
      throw new NotFoundException('task not found');
    }
  }

  async create(taskCreateRequestDto: TaskCreateRequestDto): Promise<task.Task> {
    try {
      const res = await firstValueFrom(
        this.taskServiceClient.create({
          ...taskCreateRequestDto,
        }),
      );
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: string): Promise<task.Task> {
    const observable = this.taskServiceClient.deleteOne({
      id: id,
    });
    try {
      const res = await firstValueFrom(observable);
      return res;
    } catch (_) {
      throw new NotFoundException('task not found');
    }
  }

  update(
    id: string,
    taskUpdateRequestDto: TaskUpdateRequestDto,
  ): Observable<task.Task> {
    return this.taskServiceClient.updateOne({
      id: id,
      ...taskUpdateRequestDto,
    });
  }
}
