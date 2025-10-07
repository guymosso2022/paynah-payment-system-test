import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DebitAccountDto {
  @ApiProperty({
    description: 'The unique ID of the account to debit',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'The accountId is required' })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'The amount to debit from the account',
    example: 50,
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
