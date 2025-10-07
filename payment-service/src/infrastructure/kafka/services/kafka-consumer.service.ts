import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  IEVENT_SUBSCRIBER_PORT,
  IEventSubscriberPort,
} from 'src/domain/ports/event-subscriber.port';
import { Kafka } from 'kafkajs';
import { PaymentStatus } from 'src/domain/enums/payment-status.enum';

// @Injectable()
// export class KafkaConsumerService implements OnModuleInit {
//   private kafka = new Kafka({
//     clientId: 'transaction-service',
//     brokers: ['localhost:9092'],
//   });

//   constructor(
//     @Inject(IEVENT_SUBSCRIBER_PORT)
//     private readonly subscriber: IEventSubscriberPort,
//   ) {}

//   async onModuleInit() {
//     await this.startConsumer('payment-update-group', [
//       'payment-account-created-integration-events',
//     ]);
//   }

//   private async startConsumer(groupId: string, topics: string[]) {
//     const consumer = this.kafka.consumer({
//       groupId,
//       sessionTimeout: 30000,
//       heartbeatInterval: 3000,
//       rebalanceTimeout: 60000,
//     });

//     await consumer.connect();

//     for (const topic of topics) {
//       await consumer.subscribe({ topic, fromBeginning: true });
//     }

//     await consumer.run({
//       eachMessage: async ({ topic, message }) => {
//         if (!message.value) return;
//         const parsed = JSON.parse(message.value.toString());

//         try {
//           switch (topic) {
//             case 'account-debited-integration-events':
//               console.log(`[${topic}]`, parsed);
//               await this.subscriber.consumeUpdatePayment(
//                 parsed.payload.paymentId,
//                 parsed.payload.status as PaymentStatus,
//               );
//               break;
//           }
//         } catch (err) {
//           console.error(`Erreur traitement ${topic}`, err);
//         }
//       },
//     });
//   }
// }

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
  });

  constructor(
    @Inject(IEVENT_SUBSCRIBER_PORT)
    private readonly subscriber: IEventSubscriberPort,
  ) {}

  async onModuleInit() {
    await this.startConsumer('payment-update-group', [
      'payment-account-created-integration-events',
    ]);
  }

  private async startConsumer(groupId: string, topics: string[]) {
    const consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      rebalanceTimeout: 60000,
    });

    await consumer.connect();

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;

        let parsed: any;
        try {
          parsed = JSON.parse(message.value.toString());
        } catch (err) {
          console.error(`Error parsing message from topic ${topic}`, err);
          return;
        }

        try {
          switch (topic) {
            case 'payment-account-created-integration-events': {
              console.log(`[${topic}]`, parsed);

              const status: PaymentStatus =
                PaymentStatus[
                  parsed.payload.status as keyof typeof PaymentStatus
                ];

              await this.subscriber.consumeUpdatePayment(
                parsed.payload.paymentId,
                parsed.payload.status,
              );
              break;
            }

            default:
              console.warn(`Unhandled topic: ${topic}`);
              break;
          }
        } catch (err) {
          console.error(`Error processing message from topic ${topic}`, err);
        }
      },
    });
  }
}
