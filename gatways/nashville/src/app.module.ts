import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TaskModule],
  providers: [],
})
export class AppModule {}
