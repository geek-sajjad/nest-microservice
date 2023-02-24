import { Module } from '@nestjs/common';
import { RabbitMqOptionsService } from './services/rabbitmq.options.service';

@Module({
  exports: [RabbitMqOptionsService],
  providers: [RabbitMqOptionsService],
})
export class RabbitmqOptionsModule {}
