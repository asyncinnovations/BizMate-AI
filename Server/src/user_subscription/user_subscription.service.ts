import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { AuthUsers } from "src/auth/user.entity";
import {
  UserSubscription,
  SubscriptionStatus,
} from "./user_subscription.entity";
import { SubscriptionPlan } from "src/subscription_plans/subscription_plans.entity";

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepo: Repository<UserSubscription>,
    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>,
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>
  ) {}

  ///////////////////////////////////////////
  // Create a User Subscription
  ///////////////////////////////////////////
  async createSubscription(
    userId: string,
    planId: string
  ): Promise<UserSubscription> {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const plan = await this.planRepo.findOne({
      where: { uuid: planId, is_active: true },
    });
    if (!plan) throw new NotFoundException("Plan not found or inactive");

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    const subscription = this.subscriptionRepo.create({
      user_id: userId,
      plan_id: planId,
      start_date: startDate,
      end_date: endDate,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.subscriptionRepo.save(subscription);
  }

  ///////////////////////////////////////////
  // Get Active Subscription for a User
  ///////////////////////////////////////////
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    return this.subscriptionRepo.findOne({
      where: { user_id: userId, status: SubscriptionStatus.ACTIVE },
      relations: ["plan"],
    });
  }

  ///////////////////////////////////////////
  // Cancel a User Subscription
  ///////////////////////////////////////////
  async cancelSubscription(userId: string): Promise<UserSubscription> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription)
      throw new NotFoundException("Active subscription not found");

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.end_date = new Date(); // immediate end
    return this.subscriptionRepo.save(subscription);
  }

  ///////////////////////////////////////////
  // Upgrade Subscription
  ///////////////////////////////////////////
  async upgradeSubscription(
    userId: string,
    newPlanId: string
  ): Promise<UserSubscription> {
    const subscription: any = await this.getUserSubscription(userId);
    if (!subscription)
      throw new NotFoundException("Active subscription not found");

    const newPlan: any = await this.planRepo.findOne({
      where: { uuid: newPlanId, is_active: true },
    });
    if (!newPlan) throw new NotFoundException("Plan not found or inactive");

    if (newPlan.price <= subscription.plan.price) {
      throw new BadRequestException(
        "New plan must be higher than current for upgrade"
      );
    }

    subscription.plan = newPlan;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + newPlan.duration_days);
    subscription.start_date = startDate;
    subscription.end_date = endDate;

    return this.subscriptionRepo.save(subscription);
  }

  ///////////////////////////////////////////
  // Downgrade Subscription
  ///////////////////////////////////////////
  async downgradeSubscription(
    userId: string,
    newPlanId: string
  ): Promise<UserSubscription> {
    const subscription: any = await this.getUserSubscription(userId);
    if (!subscription)
      throw new NotFoundException("Active subscription not found");

    const newPlan = await this.planRepo.findOne({
      where: { uuid: newPlanId, is_active: true },
    });
    if (!newPlan) throw new NotFoundException("Plan not found or inactive");

    if (newPlan.price >= subscription.plan.price) {
      throw new BadRequestException(
        "New plan must be lower than current for downgrade"
      );
    }

    subscription.plan = newPlan;

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + newPlan.duration_days);
    subscription.start_date = startDate;
    subscription.end_date = endDate;

    return this.subscriptionRepo.save(subscription);
  }

  ///////////////////////////////////////////
  // Expire Subscriptions Past End Date
  ///////////////////////////////////////////
  async expireSubscriptions(): Promise<void> {
    const now = new Date();
    const subscriptions = await this.subscriptionRepo.find({
      where: { status: SubscriptionStatus.ACTIVE },
    });

    for (const sub of subscriptions) {
      if (sub.end_date < now) {
        sub.status = SubscriptionStatus.EXPIRED;
        await this.subscriptionRepo.save(sub);
      }
    }
  }
}
