import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<TaskEntity[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<TaskEntity> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    return task.save();
  }

  async deleteTaskById(id: number, user: User): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    return this.taskRepository.remove(task);
  }
}
