import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllOptions,
  IDatabaseRestoreOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from 'src/common/database/interfaces/database.interface';
import { QueryRunner } from 'typeorm';
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
    data: CreateTaskDto, //TODO set create task dto here...
    options?: IDatabaseCreateOptions<QueryRunner>,
  ): Promise<TaskEntity>;

  updateOneById(
    id: string,
    data: UpdateTaskDto, //TODO set updateTaskDto here...
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
}
