import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { task } from 'src/proto-interfaces/task-proto-interface';
import { CreateTaskRequestDto } from './dtos/create-task-request.dto';
import { UpdateTaskRequestDto } from './dtos/update-task-request.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('')
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Post('create')
  create(
    @Body() createTaskRequestDto: CreateTaskRequestDto,
  ): Observable<task.Task> {
    return this.taskService.create(createTaskRequestDto);
  }

  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateTaskRequestDto: UpdateTaskRequestDto,
  ) {
    return this.taskService.update(id, updateTaskRequestDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(id);
  }
}
