import { SubscriptionPlanService } from "./subscription_plans.service";
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionPlanService);
    getAllPlans(): Promise<{
        success: boolean;
        plans: import("./subscription_plans.entity").SubscriptionPlan[];
    }>;
    subscribeUser(userId: string, planId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    getUserSubscription(userId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription | null;
    }>;
    cancelSubscription(userId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    upgradeSubscription(userId: string, newPlanId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    downgradeSubscription(userId: string, newPlanId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
}
