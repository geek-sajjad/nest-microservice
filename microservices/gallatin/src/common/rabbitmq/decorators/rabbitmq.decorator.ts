import { Inject } from '@nestjs/common';
import { RABBITMQ_SERVICE_NAME } from '../constants/rabbitmq.constant';

export function RabbitmqClient(name?: string): ParameterDecorator {
  return Inject(name || RABBITMQ_SERVICE_NAME);
}
