import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { TaskController } from './controllers/task.controller';
import { TaskRepositoryModule } from './repository/task.repository.module';
import { TaskService } from './services/task.service';

@Module({
  imports: [TaskRepositoryModule, LoggerModule],
  exports: [TaskService],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
