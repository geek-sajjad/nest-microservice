import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASK_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'task',
          protoPath: join(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'proto/task.proto',
          ),
        },
      },
    ]),
  ],
  providers: [TaskService],
  controllers: [TaskController],
  // exports: [],
})
export class TaskModule {}
