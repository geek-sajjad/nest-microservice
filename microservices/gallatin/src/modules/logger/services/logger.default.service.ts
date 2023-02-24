import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitmqClient } from 'src/common/rabbitmq/decorators/rabbitmq.decorator';
import { DATA_INSERTED_INTO_DATABASE } from '../constants/logger.events.constant';
import { ILoggerService } from '../interfaces/logger-service.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  constructor(@RabbitmqClient() private client: ClientProxy) {}

  logger(message: string, eventType: string): void {
    this.client.emit(eventType, { message });
  }
}
