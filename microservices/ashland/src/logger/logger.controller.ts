import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class LoggerController {
  @EventPattern('DATA_INSERTED')
  handleDataInserted() {
    console.log('logging... handle data inserted');
  }

  @EventPattern('DATA_UPDATED')
  handleDataUpdated() {
    console.log('logging... handle data updated');
  }

  @EventPattern('DATA_DELETED')
  handleDataDeleted() {
    console.log('logging... handle data deleted');
  }

  @EventPattern('DATA_INQUIRED')
  handleDataInquired() {
    console.log('logging... handle data inquired');
  }
}
