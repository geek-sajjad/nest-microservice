import { ClientProviderOptions } from '@nestjs/microservices';

export interface IRabbitmqService {
  createOptions(): ClientProviderOptions;
}
