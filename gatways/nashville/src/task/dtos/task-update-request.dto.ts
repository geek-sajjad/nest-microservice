import { PartialType } from '@nestjs/mapped-types';
import { TaskCreateRequestDto } from './task-create-request.dto';

export class TaskUpdateRequestDto extends PartialType(TaskCreateRequestDto) {}
