import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor() {
    this._fillTasks();
  }

  private _fillTasks() {
    const task = { title: 'Test title', description: 'description' };
    for (let i = 0; i < 3; i++) {
      this.createTask({ ...task, title: task.title + ' ' + i });
    }
    this.tasks.push({
      description: 'Desc',
      id: '1',
      title: 'Task title 228',
      status: TaskStatus.OPEN,
    });
  }

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { search, status } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task => task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { description, title } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    console.log('status >>>>', status);
    if (task) {
      task.status = status;
    }
    return task;
  }

  deleteTaskById(id: string): Task {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      return this.tasks.splice(index, 1)[0];
    } else {
      throw new NotFoundException(`Task with "${id}" not found`);
    }
  }
}
