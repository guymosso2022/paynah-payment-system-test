import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
// import { EventSubscriberService } from '../infrastructure/services/event-subscriber.service';
import { IEVENT_SUBSCRIBER_PORT } from 'src/domain/ports/event-suscriber.port';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { EventSubscriberService } from './services/event-subscriber.service';
// import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';
import { KafkaConsumerService } from 'src/infrastructure/kafka/kafka-consumer.service';
import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';

export const CommandHandlers = [CreateTransactionHandler];

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [...CommandHandlers],
  exports: [...CommandHandlers, CqrsModule],
})
export class ApplicationModule {}
