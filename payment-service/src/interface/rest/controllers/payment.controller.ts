import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from 'src/application/commands/create-payment.command';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payments Endpoint')
@Controller('payments')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment successfully created',
  })
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
