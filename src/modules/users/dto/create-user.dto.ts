import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { EmailIsNotInUse } from 'src/modules/class-validator/validators/email-is-not-in-use';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @EmailIsNotInUse()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
