import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Source account ID should not be empty' })
  @IsString({ message: 'Source account ID must be a string' })
  sourceAccountId: string;

  @IsNotEmpty({ message: 'Target account ID should not be empty' })
  @IsString({ message: 'Target account ID must be a string' })
  targetAccountId: string;

  @IsNotEmpty({ message: 'Amount should not be empty' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be at least 0.01' })
  amount: number;

  @IsNotEmpty({ message: 'Currency should not be empty' })
  @IsString({ message: 'Currency must be a string' })
  currency: string;
}
