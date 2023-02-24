import {
  TASK_DEFAULT_AVAILABLE_SORT,
  TASK_DEFAULT_PAGE,
  TASK_DEFAULT_NAX_PER_PAGE,
  TASK_DEFAULT_SORT,
} from 'src/modules/task/constants/task-list.constant';
import { PaginationListAbstract } from '../../../common/pagination/abstracts/pagination.abstract';
import {
  PaginationAvailableSort,
  PaginationPage,
  PaginationPerPage,
  PaginationSort,
} from '../../../common/pagination/decorators/pagination.decorator';
import { IPaginationSort } from '../../../common/pagination/interfaces/pagination.interfaces';

export class TaskListDto extends PaginationListAbstract {
  @PaginationPage(TASK_DEFAULT_PAGE)
  readonly page: number;

  @PaginationPerPage(TASK_DEFAULT_NAX_PER_PAGE)
  readonly perPage: number;

  @PaginationSort(TASK_DEFAULT_SORT, TASK_DEFAULT_AVAILABLE_SORT)
  readonly sort: IPaginationSort;

  @PaginationAvailableSort(TASK_DEFAULT_AVAILABLE_SORT)
  readonly availableSort: string[];
}
