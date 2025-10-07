import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Source account ID',
    example: '1c9e54a7-5f2b-4c1d-82fa-2c963f66afa6',
  })
  @IsNotEmpty({ message: 'Source account ID should not be empty' })
  @IsString({ message: 'Source account ID must be a string' })
  sourceAccountId: string;

  @ApiProperty({
    description: 'Target account ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsNotEmpty({ message: 'Target account ID should not be empty' })
  @IsString({ message: 'Target account ID must be a string' })
  targetAccountId: string;

  @ApiProperty({ description: 'Amount to transfer', example: 100 })
  @IsNotEmpty({ message: 'Amount should not be empty' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be at least 0.01' })
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'XOF' })
  @IsNotEmpty({ message: 'Currency should not be empty' })
  @IsString({ message: 'Currency must be a string' })
  currency: string;
}
