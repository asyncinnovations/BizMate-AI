import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { UserSubscriptionService } from "./user_subscription.service";

@Controller("user-subscription")
export class UserSubscriptionController {
  constructor(private readonly subscriptionService: UserSubscriptionService) {}

  ///////////////////////////////////////////
  // Create a Subscription for a User
  ///////////////////////////////////////////
  @Post(":userId/create")
  async createSubscription(
    @Param("userId") userId: string,
    @Body("planId") planId: string
  ) {
    const subscription = await this.subscriptionService.createSubscription(
      userId,
      planId
    );
    return { success: true, subscription };
  }

  ///////////////////////////////////////////
  // Get Active Subscription of a User
  ///////////////////////////////////////////
  @Get(":userId/current")
  async getUserSubscription(@Param("userId") userId: string) {
    const subscription =
      await this.subscriptionService.getUserSubscription(userId);
    return { success: true, subscription };
  }

  ///////////////////////////////////////////
  // Cancel a User Subscription
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
