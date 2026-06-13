import { SubscriptionPlanService } from "./subscription_plans.service";
export declare class SubscriptionPlanController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionPlanService);
    create_subscription_plan(body: any): Promise<{
        message: string;
        response: any;
    }>;
    all_subscription_plan(): Promise<{
        success: boolean;
        plans: import("./subscription_plans.entity").SubscriptionPlan[];
    }>;
    subscribe_subscription_plan(userId: string, planId: string): Promise<{
        success: boolean;
        subscription: any;
    }>;
    user_subscription_plan(userId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription | null;
    }>;
    cancel_subscription_plan(userId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    upgrade_subscription_plan(userId: string, newPlanId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    downgrade_subscription_plan(userId: string, newPlanId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
}
