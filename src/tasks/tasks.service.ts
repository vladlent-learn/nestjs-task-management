import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor() {}

  getAllTasks() {
    return Promise.resolve(this.tasks);
  }
}
