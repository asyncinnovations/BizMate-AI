import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SubscriptionPlan } from "./subscription_plans.entity";
import { AuthUsers } from "src/auth/user.entity";
import {
  SubscriptionStatus,
  UserSubscription,
} from "src/user_subscription/user_subscription.entity";

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepo: Repository<UserSubscription>,
    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>
  ) {}

  ///////////////////////////////////////////
  // List All Active Subscription Plans
  ///////////////////////////////////////////
  async all_subscription_plan_service(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({ where: { is_active: true } });
  }

  ///////////////////////////////////////////
  // CREATE SUBSCRIPTION PLAN
  ///////////////////////////////////////////
  async create_subscription_plan_service(data: any) {
    const response = this.planRepo.create(data);
    const result = await this.planRepo.save(response);
    return result;
  }

  ///////////////////////////////////////////
  // Subscribe a User to a Plan
  ///////////////////////////////////////////
  async subscribe_subscription_plan_service(userId: string, planId: string) {
    const user = await this.userRepo.findOne({ where: { uuid: userId } });
    if (!user) throw new NotFoundException("User not found");

    const plan = await this.planRepo.findOne({
      where: { uuid: planId, is_active: true },
    });
    if (!plan) throw new NotFoundException("Plan not found or inactive");

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    const subscription = this.userSubscriptionRepo.create({
      user_id: userId,
      plan_id: planId,
      end_date: endDate,
      start_date: startDate,
      // status: "active",
    });

    return this.userSubscriptionRepo.save(subscription);
  }

  ///////////////////////////////////////////
  // Get Current Subscription of a User
  ///////////////////////////////////////////
  async user_subscription_plan_service(
    userId: string
  ): Promise<UserSubscription | null> {
    return this.userSubscriptionRepo.findOne({
      where: {
        user_id: userId,
        status: SubscriptionStatus.ACTIVE,
      },
      // relations: ["subscription_plans"],
    });
  }

  ///////////////////////////////////////////
  // Cancel a User Subscription
  ///////////////////////////////////////////
  async cancel_subscription_plan_service(
    userId: string
  ): Promise<UserSubscription> {
    const subscription: any = await this.user_subscription_plan_service(userId);
    if (!subscription)
      throw new NotFoundException("Active subscription not found");

    subscription.status = "cancelled";
    subscription.end_date = new Date(); // immediate end
    return this.userSubscriptionRepo.save(subscription);
  }

  ///////////////////////////////////////////
  // Expire Subscriptions Past End Date
  ///////////////////////////////////////////
  async expire_subscription_plan_service(): Promise<void> {
    const now = new Date();
    const subscriptions: any = await this.userSubscriptionRepo.find({
      where: {
        // status: "active"
      },
    });

    for (const sub of subscriptions) {
      if (sub.end_date < now) {
        sub.status = "expired";
        await this.userSubscriptionRepo.save(sub);
      }
    }
  }

  ///////////////////////////////////////////
  // Upgrade Subscription
  ///////////////////////////////////////////
  async upgrade_subscription_plan_service(
    userId: string,
    newPlanId: string
  ): Promise<UserSubscription> {
    const currentSub: any = await this.user_subscription_plan_service(userId);
    if (!currentSub)
      throw new NotFoundException("Active subscription not found");

    const newPlan = await this.planRepo.findOne({
      where: { uuid: newPlanId, is_active: true },
    });
    if (!newPlan) throw new NotFoundException("Plan not found or inactive");

    // Optionally, ensure the new plan is higher than current
    if (newPlan.price <= currentSub.plan.price) {
      throw new BadRequestException(
        "New plan must be higher than current plan for upgrade"
      );
    }

    // Upgrade immediately
    currentSub.plan = newPlan;

    // Optionally, reset subscription duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + newPlan.duration_days);
    currentSub.start_date = startDate;
    currentSub.end_date = endDate;

    return this.userSubscriptionRepo.save(currentSub);
  }

  ///////////////////////////////////////////
  // Downgrade Subscription
  ///////////////////////////////////////////
  async downgrade_subscription_plan_service(
    userId: string,
    newPlanId: string
  ): Promise<UserSubscription> {
    const currentSub: any = await this.user_subscription_plan_service(userId);
    if (!currentSub)
      throw new NotFoundException("Active subscription not found");

    const newPlan = await this.planRepo.findOne({
      where: { uuid: newPlanId, is_active: true },
    });
    if (!newPlan) throw new NotFoundException("Plan not found or inactive");

    // Optionally, ensure the new plan is lower than current
    if (newPlan.price >= currentSub.plan.price) {
      throw new BadRequestException(
        "New plan must be lower than current plan for downgrade"
      );
    }

    // Downgrade immediately
    currentSub.plan = newPlan;

    // Optionally, reset subscription duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + newPlan.duration_days);
    currentSub.start_date = startDate;
    currentSub.end_date = endDate;

    return this.userSubscriptionRepo.save(currentSub);
  }
}
