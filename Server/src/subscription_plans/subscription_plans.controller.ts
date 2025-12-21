import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { SubscriptionPlanService } from "./subscription_plans.service";

@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionPlanService) {}

  ///////////////////////////////////////////
  // List All Active Subscription Plans
  ///////////////////////////////////////////
  @Get("plans")
  async getAllPlans() {
    const plans = await this.subscriptionService.getAllPlans();
    return { success: true, plans };
  }

  ///////////////////////////////////////////
  // Subscribe a User to a Plan
  ///////////////////////////////////////////
  @Post(":userId/subscribe")
  async subscribeUser(
    @Param("userId") userId: string,
    @Body("planId") planId: string
  ) {
    const subscription = await this.subscriptionService.subscribeUser(
      userId,
      planId
    );
    return { success: true, subscription };
  }

  ///////////////////////////////////////////
  // Get Current Subscription of a User
  ///////////////////////////////////////////
  @Get(":userId/current")
  async getUserSubscription(@Param("userId") userId: string) {
    const subscription =
      await this.subscriptionService.getUserSubscription(userId);
    return { success: true, subscription };
  }

  ///////////////////////////////////////////
  // Cancel Subscription
  ///////////////////////////////////////////
  @Post(":userId/cancel")
  async cancelSubscription(@Param("userId") userId: string) {
    const subscription =
      await this.subscriptionService.cancelSubscription(userId);
    return { success: true, subscription };
  }

  ///////////////////////////////////////////
  // Upgrade Subscription
  ///////////////////////////////////////////
  @Post(":userId/upgrade")
  async upgradeSubscription(
    @Param("userId") userId: string,
    @Body("planId") newPlanId: string
  ) {
    const subscription = await this.subscriptionService.upgradeSubscription(
      userId,
      newPlanId
    );
    return { success: true, subscription };
  }

  ///////////////////////////////////////////
  // Downgrade Subscription
  ///////////////////////////////////////////
  @Post(":userId/downgrade")
  async downgradeSubscription(
    @Param("userId") userId: string,
    @Body("planId") newPlanId: string
  ) {
    const subscription = await this.subscriptionService.downgradeSubscription(
      userId,
      newPlanId
    );
    return { success: true, subscription };
  }
}
