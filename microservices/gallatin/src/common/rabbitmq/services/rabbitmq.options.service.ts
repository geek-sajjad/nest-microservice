import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { RABBITMQ_SERVICE_NAME } from '../constants/rabbitmq.constant';
import { IRabbitmqService } from '../interfaces/rabbitmq.service.interface';

@Injectable()
export class RabbitMqOptionsService implements IRabbitmqService {
  private readonly url: string;
  private readonly queue: string;
  private readonly durable: boolean;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('rabbitmq.url');
    this.queue = this.configService.get<string>('rabbitmq.queue');
    this.durable = this.configService.get<boolean>('rabbitmq.durable');
  }

  createOptions(): ClientProviderOptions {
    return {
      name: RABBITMQ_SERVICE_NAME,
      transport: Transport.RMQ,
      options: {
        urls: [this.url],
        queue: this.queue,
        queueOptions: {
          durable: this.durable,
        },
      },
    };
  }
}
