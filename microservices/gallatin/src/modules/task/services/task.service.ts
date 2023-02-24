import { Injectable } from '@nestjs/common/decorators';
import {
  IDatabaseFindAllOptions,
  IDatabaseCreateOptions,
  IDatabaseUpdateOptions,
  IDatabaseDeleteOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseRestoreOptions,
} from 'src/common/database/interfaces/database.interface';
import {
  DATA_INSERTED_INTO_DATABASE,
  DATA_DELETED_INTO_DATABASE,
  DATA_INQUIRED_FROM_DATABASE,
  DATA_UPDATED_INTO_DATABASE,
} from 'src/modules/logger/constants/logger.events.constant';
import { LoggerService } from 'src/modules/logger/services/logger.default.service';
import { QueryRunner, Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ITaskService } from '../interfaces/task.service.interface';
import { TaskEntity } from '../repository/entities/task.entity';
import { TaskRepository } from '../repository/repositories/task.repository';

@Injectable()
export class TaskService implements ITaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly loggerService: LoggerService,
  ) {}

  findAll(
    find?: Record<string, any> | Record<string, any>[],
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<TaskEntity[]> {
    this.loggerService.logger('no message', DATA_INQUIRED_FROM_DATABASE);
    return this.taskRepository.findAll(find, options);
  }

  findOneById(
    id: string,
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    this.loggerService.logger('no message', DATA_INQUIRED_FROM_DATABASE);
    return this.taskRepository.findOneById(id, options);
  }

  findOneByIdWithParent(id: string) {
    this.loggerService.logger('no message', DATA_INQUIRED_FROM_DATABASE);

    return this.taskRepository.findOneByIdWithParent(id);
  }

  async findOneByIdWithChild(id: string) {
    this.loggerService.logger('no message', DATA_INQUIRED_FROM_DATABASE);

    return this.taskRepository.findOneByIdWithChild(id);
  }

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    this.loggerService.logger('no message', DATA_INQUIRED_FROM_DATABASE);

    return this.taskRepository.findOne(find, options);
  }

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<number> {
    return this.taskRepository.getTotal(find, options);
  }

  create(
    data: CreateTaskDto,
    options?: IDatabaseCreateOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    this.loggerService.logger('no message', DATA_INSERTED_INTO_DATABASE);

    // TODO add limit to how deep the graph can grow
    return this.taskRepository.create<CreateTaskDto>(data, options);
  }

  updateOneById(
    id: string,
    data: UpdateTaskDto,
    options?: IDatabaseUpdateOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    this.loggerService.logger('no message', DATA_UPDATED_INTO_DATABASE);

    return this.taskRepository.updateOneById<UpdateTaskDto>(id, data, options);
  }

  deleteOneById(
    id: string,
    options?: IDatabaseDeleteOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    this.loggerService.logger('no message', DATA_DELETED_INTO_DATABASE);

    return this.taskRepository.deleteOneById(id, options);
  }

  softDeleteOneById(
    id: string,
    options?: IDatabaseSoftDeleteOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    this.loggerService.logger('no message', DATA_DELETED_INTO_DATABASE);

    return this.taskRepository.softDeleteOneById(id, options);
  }

  restoreOneById(
    id: string,
    options?: IDatabaseRestoreOptions<QueryRunner>,
  ): Promise<TaskEntity> {
    return this.taskRepository.restoreOneById(id, options);
  }

  repository(): Repository<TaskEntity> {
    return this.taskRepository.repository();
  }
}
