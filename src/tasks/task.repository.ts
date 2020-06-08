import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  private readonly logger = new Logger('TaskRepository');

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<TaskEntity> {
    const { description, title } = createTaskDto;
    const task = new TaskEntity();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();
    delete task.user;

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<TaskEntity[]> {
    const { search, status } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {
        search: `%${search}%`,
      });
    }

    try {
      return await query.getMany();
    } catch (e) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        e.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
