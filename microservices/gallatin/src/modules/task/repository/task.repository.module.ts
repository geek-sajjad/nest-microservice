import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';

@Module({
  providers: [TaskRepository],
  exports: [TaskRepository],
  imports: [TypeOrmModule.forFeature([TaskEntity])],
})
export class TaskRepositoryModule {}
