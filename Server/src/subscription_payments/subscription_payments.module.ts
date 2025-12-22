import { Module } from "@nestjs/common";
import { SubscriptionPaymentsService } from "./subscription_payments.service";
import { SubscriptionPaymentsController } from "./subscription_payments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionPayment } from "./subscription_payments.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPayment, UserSubscription])],
  providers: [SubscriptionPaymentsService],
  controllers: [SubscriptionPaymentsController],
})
export class SubscriptionPaymentsModule {}
