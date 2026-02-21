import { Module } from "@nestjs/common";
import { SubscriptionUsageService } from "./subscription_usage.service";
import { SubscriptionUsageController } from "./subscription_usage.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionUsage } from "./subscription_usage.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionUsage])],
  providers: [SubscriptionUsageService],
  controllers: [SubscriptionUsageController],
})
export class SubscriptionUsageModule {}
