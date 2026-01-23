import { Module } from '@nestjs/common';
import { SubscriptionUsageService } from './subscription_usage.service';
import { SubscriptionUsageController } from './subscription_usage.controller';

@Module({
  providers: [SubscriptionUsageService],
  controllers: [SubscriptionUsageController]
})
export class SubscriptionUsageModule {}
