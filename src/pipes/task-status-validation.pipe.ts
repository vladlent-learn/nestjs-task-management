import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../tasks/task.model';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint()
export class TaskStatusValidationPipe implements PipeTransform, ValidatorConstraintInterface {
  transform(value: any) {
    if (value in TaskStatus) {
      return value;
    } else {
      throw new BadRequestException(`${value} is an invalid status`);
    }
  }

  validate(value: any): boolean {
    return this.transform(value);
  }
}

export function IsValidTaskStatus(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidTaskStatus',
      target: object.constructor,
      propertyName,
      validator: TaskStatusValidationPipe,
      options: validationOptions,
    });
  };
}
