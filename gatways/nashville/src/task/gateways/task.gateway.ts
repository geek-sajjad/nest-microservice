import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { from, map } from 'rxjs';
import { Server } from 'ws';
import { TaskService } from '../task.service';

@WebSocketGateway(4040, {
  cors: {
    origin: '*',
  },
})
export class TaskGateWay {
  constructor(private readonly taskService: TaskService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('task.getAll')
  async onFindAllTasks(client: any, data: any) {
    const result = await this.taskService.findAll(data);
    return result;
  }

  @SubscribeMessage('task.create')
  async onCreateTask(client: any, data: any) {
    try {
      const res = await this.taskService.create({
        ...data,
      });
      client.emit('task.getAll');
      return res;
    } catch (error) {
      return {
        status: 400,
        message: 'bad request.',
      };
    }
  }
}
