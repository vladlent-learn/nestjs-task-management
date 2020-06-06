import { TaskStatus } from '../task.model';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidTaskStatus } from '../../pipes/task-status-validation.pipe';

export class GetTasksFilterDto {
  @IsOptional()
  @IsValidTaskStatus()
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
