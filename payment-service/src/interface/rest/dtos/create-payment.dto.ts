import { IsString, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  sourceAccountId: string;

  @IsString()
  targetAccountId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency: string;
}
