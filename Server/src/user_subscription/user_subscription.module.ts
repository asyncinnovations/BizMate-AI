import { Module } from "@nestjs/common";
import { UserSubscriptionService } from "./user_subscription.service";
import { UserSubscriptionController } from "./user_subscription.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSubscription } from "./user_subscription.entity";
import { AuthUsers } from "src/auth/user.entity";
import { SubscriptionPlan } from "src/subscription_plans/subscription_plans.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscription, SubscriptionPlan,AuthUsers])],
  providers: [UserSubscriptionService],
  controllers: [UserSubscriptionController],
})
export class UserSubscriptionModule {}
