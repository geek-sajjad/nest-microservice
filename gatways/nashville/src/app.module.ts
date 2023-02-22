import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { TaskController } from './task/task.controller';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TaskModule,
    // ClientsModule.register([
    //   {
    //     name: 'TASK_PACKAGE',
    //     transport: Transport.GRPC,
    //     options: {
    //       package: 'task',
    //       protoPath: join(__dirname, '..', '..', '..', 'proto/task.proto'),
    //     },
    //   },
    // ]),
  ],
  // controllers: [,/* AppController */],
  providers: [],
})
export class AppModule {}
