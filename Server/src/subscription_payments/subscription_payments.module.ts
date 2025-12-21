import { Module } from '@nestjs/common';
import { SubscriptionPaymentsService } from './subscription_payments.service';
import { SubscriptionPaymentsController } from './subscription_payments.controller';
import { SubscriptionPaymentsController } from './subscription_payments.controller';

@Module({
  providers: [SubscriptionPaymentsService],
  controllers: [SubscriptionPaymentsController]
})
export class SubscriptionPaymentsModule {}
