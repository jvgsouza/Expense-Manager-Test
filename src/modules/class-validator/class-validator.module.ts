import { Module } from '@nestjs/common';
import { UserExistRule } from './validators/user-exist.service';
import { UsersModule } from 'src/modules/users/users.module';
import { EmailIsNotInUseRule } from './validators/email-is-not-in-use';

@Module({
  imports: [UsersModule],
  providers: [UserExistRule, EmailIsNotInUseRule],
})
export class ClassValidatorModule {}
