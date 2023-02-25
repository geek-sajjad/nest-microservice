import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';

describe('TaskController', () => {
  let controller: TaskController;

  const mockTaskService = {};
  const mockPaginationService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [PaginationService, TaskService],
    })

      .useMocker((token) => {
        const results = ['test1', 'test2'];

        if (token === TaskService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
      })
      // .overrideProvider([PaginationService, TaskService])

      // .useValue([mockPaginationService, mockTaskService])
      .compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(TaskController).toBeDefined();
  });
});
