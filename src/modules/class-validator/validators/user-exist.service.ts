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
export class UserExistRule implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(userId: number) {
    const user = await this.usersService.findOne(userId);
    return user != null ? true : false;
  }

  defaultMessage() {
    return `User doesn't exist`;
  }
}

export function UserExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'UserExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserExistRule,
    });
  };
}
