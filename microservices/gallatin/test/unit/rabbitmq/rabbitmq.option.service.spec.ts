import { ConfigModule, registerAs } from '@nestjs/config';
import { ClientProviderOptions } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqOptionsModule } from 'src/common/rabbitmq/rabbitmq.options.module';
import { RabbitMqOptionsService } from 'src/common/rabbitmq/services/rabbitmq.options.service';

describe('RabbitmqOptionServiceUnitTest', () => {
  let rabbitmqOptionService: RabbitMqOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            registerAs('rabbitmq', () => ({
              url: process.env?.RABBITMQ_URL ?? 'amqp://localhost:5672',
              queue: process.env?.RABBITMQ_QUEUE ?? 'loggs_queue',
              durable: process.env?.RABBITMQ_DURABLE ?? false,
            })),
          ],
          isGlobal: true,
          envFilePath: ['.env'],
          expandVariables: true,
        }),
        RabbitmqOptionsModule,
      ],
    }).compile();

    rabbitmqOptionService = module.get<RabbitMqOptionsService>(
      RabbitMqOptionsService,
    );
  });

  it('should be defined', () => {
    expect(rabbitmqOptionService).toBeDefined();
  });

  it('should return rabbitmqOption', () => {
    const res: ClientProviderOptions = rabbitmqOptionService.createOptions();

    expect(res).toBeDefined();
    expect(res).toBeTruthy();
  });
});
