import { Repository } from "typeorm";
import { SubscriptionPlan } from "./subscription_plans.entity";
import { AuthUsers } from "src/auth/user.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
export declare class SubscriptionPlanService {
    private readonly planRepo;
    private readonly userSubscriptionRepo;
    private readonly userRepo;
    constructor(planRepo: Repository<SubscriptionPlan>, userSubscriptionRepo: Repository<UserSubscription>, userRepo: Repository<AuthUsers>);
    getAllPlans(): Promise<SubscriptionPlan[]>;
    subscribeUser(userId: string, planId: string): Promise<UserSubscription>;
    getUserSubscription(userId: string): Promise<UserSubscription | null>;
    cancelSubscription(userId: string): Promise<UserSubscription>;
    expireSubscriptions(): Promise<void>;
    upgradeSubscription(userId: string, newPlanId: string): Promise<UserSubscription>;
    downgradeSubscription(userId: string, newPlanId: string): Promise<UserSubscription>;
}
