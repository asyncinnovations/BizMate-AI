import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription_plans.service';
import { SubscriptionController } from './subscription_plans.controller';

@Module({
  providers: [SubscriptionService],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
