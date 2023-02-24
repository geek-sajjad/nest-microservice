import { Injectable } from '@nestjs/common';
import { DatabaseBaseRepositoryAbstract } from 'src/common/database/abstracts/database.base-repository.abstract';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { DatabaseModel } from 'src/common/database/decorators/database.decorator';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TaskRepository extends DatabaseBaseRepositoryAbstract<TaskEntity> {
  constructor(
    @DatabaseModel(TaskEntity, DATABASE_CONNECTION_NAME)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {
    super(taskRepository);
  }

  findOneByIdWithParent(id: string) {
    return this._repository
      .createQueryBuilder('task')
      .where('task.id = :id', { id })
      .innerJoinAndSelect('task.parent', 'parent')
      .getOne();
  }

  async findOneByIdWithChild(id: string) {
    const child = await this._repository
      .createQueryBuilder('task')
      .where('task.parent_id = :id', { id })
      .getOne();

    const parent = await this._repository
      .createQueryBuilder('task')
      .where('task.id = :id', { id })
      .getOne();

    parent.child = child;
    return parent;
  }
}
