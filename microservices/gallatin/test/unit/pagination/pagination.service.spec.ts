import { Test, TestingModule } from '@nestjs/testing';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { PaginationService } from 'src/common/pagination/services/pagination.service';

describe('PaginationServiceUnitTest', () => {
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaginationModule],
    }).compile();

    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(paginationService).toBeDefined();
  });

  describe('total pages', () => {
    it('should return total pages based on limit perPage and total data', async () => {
      const result: number = paginationService.totalPage(50, 2);

      expect(result).toBeDefined();
      expect(result).toBe(25);
    });

    it('should be return a 1 because total data is zero', async () => {
      const result: number = paginationService.totalPage(0, 10);

      expect(result).toBeDefined();
      expect(result).toBe(1);
    });
  });
});
