import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllOptions,
  IDatabaseRestoreOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from 'src/common/database/interfaces/database.interface';
import { QueryRunner, Repository } from 'typeorm';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { TaskEntity } from '../repository/entities/task.entity';

export interface ITaskService {
  findAll(
    find?: Record<string, any> | Record<string, any>[],
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<TaskEntity[]>;

  findOneById(
    id: string,
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<QueryRunner>,
  ): Promise<number>;

  create(
    data: CreateTaskDto,
    options?: IDatabaseCreateOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  updateOneById(
    id: string,
    data: UpdateTaskDto,
    options?: IDatabaseUpdateOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  deleteOneById(
    id: string,
    options?: IDatabaseDeleteOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  softDeleteOneById(
    id: string,
    options?: IDatabaseSoftDeleteOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  restoreOneById(
    id: string,
    options?: IDatabaseRestoreOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  repository(): Repository<TaskEntity>;
}
