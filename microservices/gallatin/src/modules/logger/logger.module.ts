import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RABBITMQ_SERVICE_NAME } from 'src/common/rabbitmq/constants/rabbitmq.constant';
import { RabbitmqOptionsModule } from 'src/common/rabbitmq/rabbitmq.options.module';
import { RabbitMqOptionsService } from 'src/common/rabbitmq/services/rabbitmq.options.service';
import { LoggerService } from './services/logger.default.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RABBITMQ_SERVICE_NAME,
        imports: [RabbitmqOptionsModule],
        inject: [RabbitMqOptionsService],
        useFactory: (rabbitMqOptionsService: RabbitMqOptionsService) => {
          return rabbitMqOptionsService.createOptions();
        },
      },
    ]),
  ],
  controllers: [],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
