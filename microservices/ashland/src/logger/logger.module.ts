import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';

@Module({
  controllers: [LoggerController],
  exports: [],
  imports: [],
  providers: [],
})
export class LoggerModule {}
