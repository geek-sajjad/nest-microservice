import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [CommonModule, TaskModule],
  providers: [AppService],
})
export class AppModule {}
