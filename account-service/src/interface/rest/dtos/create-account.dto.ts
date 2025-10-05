import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'The initial amount is required' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'The currency is required' })
  @IsString()
  currency: string;
}
