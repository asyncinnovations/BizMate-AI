import { Module } from '@nestjs/common';
import { UserSubscriptionService } from './user_subscription.service';
import { UserSubscriptionController } from './user_subscription.controller';

@Module({
  providers: [UserSubscriptionService],
  controllers: [UserSubscriptionController]
})
export class UserSubscriptionModule {}
