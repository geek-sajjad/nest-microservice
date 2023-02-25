import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class LoggerController {
  @EventPattern('DATA_INSERTED')
  handleDataInserted(data: Record<string, unknown>) {
    console.log('logging... handle data inserted');
  }

  @EventPattern('DATA_UPDATED')
  handleDataUpdated(data: Record<string, unknown>) {
    console.log('logging... handle data updated');
  }

  @EventPattern('DATA_DELETED')
  handleDataDeleted(data: Record<string, unknown>) {
    console.log('logging... handle data deleted');
  }

  @EventPattern('DATA_INQUIRED')
  handleDataInquired(data: Record<string, unknown>) {
    console.log('logging... handle data inquired');
  }
}
