import { UserSubscriptionService } from "./user_subscription.service";
export declare class UserSubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: UserSubscriptionService);
    createSubscription(userId: string, planId: string): Promise<{
        success: boolean;
        subscription: import("./user_subscription.entity").UserSubscription;
    }>;
    getUserSubscription(userId: string): Promise<{
        success: boolean;
        subscription: import("./user_subscription.entity").UserSubscription | null;
    }>;
    cancelSubscription(userId: string): Promise<{
        success: boolean;
        subscription: import("./user_subscription.entity").UserSubscription;
    }>;
    upgradeSubscription(userId: string, newPlanId: string): Promise<{
        success: boolean;
        subscription: import("./user_subscription.entity").UserSubscription;
    }>;
    downgradeSubscription(userId: string, newPlanId: string): Promise<{
        success: boolean;
        subscription: import("./user_subscription.entity").UserSubscription;
    }>;
}
