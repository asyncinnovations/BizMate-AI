import { Repository } from "typeorm";
import { SubscriptionPlan } from "./subscription_plans.entity";
import { AuthUsers } from "src/auth/user.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
export declare class SubscriptionPlanService {
    private readonly planRepo;
    private readonly userSubscriptionRepo;
    private readonly userRepo;
    constructor(planRepo: Repository<SubscriptionPlan>, userSubscriptionRepo: Repository<UserSubscription>, userRepo: Repository<AuthUsers>);
    all_subscription_plan_service(): Promise<SubscriptionPlan[]>;
    create_subscription_plan_service(data: any): Promise<SubscriptionPlan[]>;
    subscribe_subscription_plan_service(userId: string, planId: string): Promise<UserSubscription>;
    user_subscription_plan_service(userId: string): Promise<UserSubscription | null>;
    cancel_subscription_plan_service(userId: string): Promise<UserSubscription>;
    expire_subscription_plan_service(): Promise<void>;
    upgrade_subscription_plan_service(userId: string, newPlanId: string): Promise<UserSubscription>;
    downgrade_subscription_plan_service(userId: string, newPlanId: string): Promise<UserSubscription>;
}
