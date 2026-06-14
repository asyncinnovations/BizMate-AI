import { SubscriptionPlanService } from "./subscription_plans.service";
export declare class SubscriptionPlanController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionPlanService);
    create_subscription_plan(body: any): Promise<{
        message: string;
        response: import("./subscription_plans.entity").SubscriptionPlan[];
    }>;
    all_subscription_plan(): Promise<{
        success: boolean;
        plans: import("./subscription_plans.entity").SubscriptionPlan[];
    }>;
    create_checkout_session(userId: string, body: {
        planId: string;
        gateway: string;
        currency?: string;
        action?: string;
    }): Promise<{
        free: boolean;
        subscription_id: string;
        message: string;
        payment_url?: undefined;
        order_ref?: undefined;
        session_id?: undefined;
        gateway?: undefined;
        amount?: undefined;
        currency?: undefined;
        success: boolean;
    } | {
        free: boolean;
        payment_url: string;
        order_ref: string;
        session_id: string | undefined;
        subscription_id: string;
        gateway: string;
        amount: number;
        currency: string;
        message?: undefined;
        success: boolean;
    }>;
    subscribe_subscription_plan(userId: string, planId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    user_subscription_plan(userId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription | null;
    }>;
    cancel_subscription_plan(userId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    upgrade(userId: string, planId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
    downgrade(userId: string, planId: string): Promise<{
        success: boolean;
        subscription: import("../user_subscription/user_subscription.entity").UserSubscription;
    }>;
}
