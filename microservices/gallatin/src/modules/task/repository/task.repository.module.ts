import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE_CONNECTION_NAME } from 'src/common/database/constants/database.constant';
import { TaskEntity } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity], DATABASE_CONNECTION_NAME)],
  providers: [TaskRepository],
  exports: [TaskRepository],
})
export class TaskRepositoryModule {}
