import { Expose, Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

const PAGINATION_MAX_PAGE = 20;

export class TaskListDto {
  page: string;
  perPage: string;
  sort: string;
  availableSort: string[];
}
