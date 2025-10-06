import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from 'src/application/commands/create-payment.command';
import { CreatePaymentDto } from '../dtos/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(
    @Body()
    createPaymentDtoDto: CreatePaymentDto,
  ) {
    const command = new CreatePaymentCommand(
      createPaymentDtoDto.amount,
      createPaymentDtoDto.sourceAccountId,
      createPaymentDtoDto.targetAccountId,
      createPaymentDtoDto.currency,
    );
    const payment = await this.commandBus.execute(command);
    return {
      id: payment.getId().getValue(),
      sourceAccountId: payment.getSourceAccountId().getValue(),
      targetAccountId: payment.getTargetAccountId().getValue(),
      amount: payment.getAmount().value,
      currency: payment.getAmount().currency,
      status: payment.getStatus(),
      createdAt: payment.getCreatedAt(),
      updatedAt: payment.getUpdatedAt(),
    };
  }
}
