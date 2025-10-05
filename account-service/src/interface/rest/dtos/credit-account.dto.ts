import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreditAccountDto {
  @IsNotEmpty({ message: 'The accountId is required' })
  @IsUUID()
  accountId: string;

  @IsNotEmpty({ message: 'The amount is required' })
  @IsNumber()
  amount: number;

  @IsNotEmpty({ message: 'The currency is required' })
  @IsString()
  currency: string;
}
