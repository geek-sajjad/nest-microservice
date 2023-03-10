import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ExceptionFilter } from 'src/exceptions/rpc-exception.filter';
import { task } from 'src/proto-interfaces/task-proto-interface';
import { TaskCreateRequestDto } from './dtos/task-create-request.dto';
import { TaskUpdateRequestDto } from './dtos/task-update-request.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('')
  findAll(@Query() query: any) {
    return this.taskService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(id);
  }

  @Get(':id/child')
  getWithChild(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOneWithChild(id);
  }

  @Get(':id/parent')
  getWithParent(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOneWithParent(id);
  }

  @Post()
  create(
    @Body() taskCreateRequestDto: TaskCreateRequestDto,
  ): Promise<task.Task> {
    return this.taskService.create(taskCreateRequestDto);
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() taskUpdateRequestDto: TaskUpdateRequestDto,
  ) {
    return this.taskService.update(id, taskUpdateRequestDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.delete(id);
  }
}
