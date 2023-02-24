import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { BadRequestException, Controller } from '@nestjs/common';
import { UseFilters, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
  BaseRpcExceptionFilter,
  GrpcMethod,
  RpcException,
} from '@nestjs/microservices';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { TaskListDto } from '../dtos/task-list.dto';
import { ExtractRequestParamGrpcPipe } from '../pipes/extract-request-param-grpc.pipe';
import { TaskEntity } from '../repository/entities/task.entity';
import { TaskService } from '../services/task.service';

// TODO serialize all data before sending result
@Controller()
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly paginationService: PaginationService,
  ) {}
  // TODO refactor TaskController and Grpc Methods
  @GrpcMethod('TaskService', 'Create')
  async create(data: any) {
    const { parentId } = data;
    const task = await this.taskService.create({
      title: data.title,
      description: data.description,
    });

    if (parentId) {
      const parentTask: TaskEntity = await this.taskService.findOneById(
        parentId,
      );
      if (!parentTask) throw new RpcException('parent id is not valid');

      task.parent = parentTask;

      const taskRepo = this.taskService.repository();

      await taskRepo.save(task);
    }

    return task;
  }

  @GrpcMethod('TaskService', 'FindOne')
  async findOne(
    data: any,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const id: string = data.id;

    const task: TaskEntity = await this.taskService.findOneById(id);
    return task;
  }

  @GrpcMethod('TaskService', 'FindOneWithParent')
  async findOneWithParent(
    data: any,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const { id } = data;
    const result = await this.taskService.findOneByIdWithParent(id);
    return result;
  }

  @GrpcMethod('TaskService', 'FindOneWithChild')
  async findOneWithChild(
    data: any,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const { id } = data;
    const result = await this.taskService.findOneByIdWithChild(id);
    return result;
  }

  @UsePipes(
    new ExtractRequestParamGrpcPipe('findAllRequestQueryParam'),
    new ValidationPipe({
      transform: true,
    }),
  )
  @GrpcMethod('TaskService', 'FindAll')
  async findAll(
    data: TaskListDto,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ) {
    const { availableSort, page, perPage, sort } = data;

    const skip: number = await this.paginationService.skip(page, perPage);

    const tasks: TaskEntity[] = await this.taskService.findAll(
      {},
      {
        paging: {
          limit: perPage,
          skip: skip,
        },
        sort: sort,
      },
    );

    const totalData: number = await this.taskService.getTotal({});

    const totalPage: number = await this.paginationService.totalPage(
      totalData,
      perPage,
    );

    return {
      totalData: totalData,
      totalPage: totalPage,
      currentPage: page,
      perPage: perPage,
      availableSort: availableSort,
      data: tasks,
    };
  }
  // TODO validate data
  @GrpcMethod('TaskService', 'UpdateOne')
  update(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    const { title, id, description, parentId } = data;

    return this.taskService.updateOneById(id, {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(parentId ? { parentId } : {}),
    });
  }

  @GrpcMethod('TaskService', 'DeleteOne')
  delete(data: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
    const id = data.id;
    return this.taskService.softDeleteOneById(id);
  }
}
