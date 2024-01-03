import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UsersService } from 'src/modules/users/services/users.service';

@ValidatorConstraint({ name: 'UserExist' })
@Injectable()
export class EmailIsNotInUseRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(email: string) {
    const user = await this.usersService.findByEmail(email);
    return user == null ? true : false;
  }

  defaultMessage() {
    return `Email is in use`;
  }
}

export function EmailIsNotInUse(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailIsNotInUseRule,
    });
  };
}
