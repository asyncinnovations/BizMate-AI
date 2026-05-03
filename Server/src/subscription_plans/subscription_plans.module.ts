import { Module } from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription_plans.service";
import { SubscriptionPlanController } from "./subscription_plans.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionPlan } from "./subscription_plans.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
import { AuthUsers } from "src/auth/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, UserSubscription, AuthUsers]),
  ],
  providers: [SubscriptionPlanService],
  controllers: [SubscriptionPlanController],
  exports: [SubscriptionPlanService],
})
export class SubscriptionModule {}
