import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotFutureDate', async: true })
@Injectable()
export class IsNotFutureDateRule implements ValidatorConstraintInterface {
  validate(date: Date) {
    return Date.now() > date.getTime() ? true : false;
  }

  defaultMessage() {
    return `It is not allowed to add expenses with a future date`;
  }
}

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotFutureDateRule,
    });
  };
}
