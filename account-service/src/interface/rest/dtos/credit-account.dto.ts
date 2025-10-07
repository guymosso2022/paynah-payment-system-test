import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreditAccountDto {
  @ApiProperty({
    description: 'The unique ID of the account to credit',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'The accountId is required' })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'The amount to credit to the account',
    example: 100,
  })
  @IsNotEmpty({ message: 'The amount is required' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The currency of the amount',
    example: 'XOF',
  })
  @IsNotEmpty({ message: 'The currency is required' })
  @IsString()
  currency: string;
}
