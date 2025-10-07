import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The initial amount to set on the account',
    example: 1000,
  })
  @IsNotEmpty({ message: 'The initial amount is required' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The currency of the initial amount',
    example: 'XOF',
  })
  @IsNotEmpty({ message: 'The currency is required' })
  @IsString()
  currency: string;
}
