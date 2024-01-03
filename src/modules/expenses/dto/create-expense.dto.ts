import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsNotFutureDate } from 'src/modules/class-validator/validators/is-not-future-date';
import { UserExist } from 'src/modules/class-validator/validators/user-exist.service';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(191)
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsNotFutureDate()
  date: Date;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  value: number;

  @IsNotEmpty()
  @IsNumber()
  @UserExist()
  userId: number;
}
