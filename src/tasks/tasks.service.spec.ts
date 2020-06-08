import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.model';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser = new User({ username: 'Test user', password: 'p@$$w0Rd' });
mockUser.id = 12;
const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TaskRepository, useFactory: mockTaskRepository }],
    }).compile();

    tasksService = module.get(TasksService) as TasksService;
    taskRepository = module.get(TaskRepository);
  });

  describe('getTasks()', () => {
    it('should get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('123');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'search' };

      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1);
      expect(result).toBe('123');
    });
  });

  describe('getTaskById()', () => {
    it('should call taskRepository findOne() and successfully return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw an error if task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
