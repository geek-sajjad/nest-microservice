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
}
