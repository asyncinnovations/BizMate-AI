import { Repository } from "typeorm";
import { AuthUsers } from "src/auth/user.entity";
import { UserSubscription } from "./user_subscription.entity";
import { SubscriptionPlan } from "src/subscription_plans/subscription_plans.entity";
export declare class UserSubscriptionService {
    private readonly subscriptionRepo;
    private readonly userRepo;
    private readonly planRepo;
    constructor(subscriptionRepo: Repository<UserSubscription>, userRepo: Repository<AuthUsers>, planRepo: Repository<SubscriptionPlan>);
    createSubscription(userId: string, planId: string): Promise<UserSubscription>;
    getUserSubscription(userId: string): Promise<UserSubscription | null>;
    cancelSubscription(userId: string): Promise<UserSubscription>;
    upgradeSubscription(userId: string, newPlanId: string): Promise<UserSubscription>;
    downgradeSubscription(userId: string, newPlanId: string): Promise<UserSubscription>;
    expireSubscriptions(): Promise<void>;
}
