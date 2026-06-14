import { SubscriptionUsage } from "./subscription_usage.entity";
import { SubscriptionUsageService } from "./subscription_usage.service";
export declare class SubscriptionUsageController {
    private readonly usageService;
    constructor(usageService: SubscriptionUsageService);
    incrementUsage(body: {
        subscriptionId: string;
        usageKey: string;
        amount?: number;
        periodType?: "daily" | "monthly" | "lifetime";
        limitSnapshot?: number;
        policyType?: "strict" | "fair_use" | "unlimited";
    }): Promise<SubscriptionUsage>;
    getUsage(subscriptionId: string, usageKey: string, periodType?: "daily" | "monthly" | "lifetime"): Promise<SubscriptionUsage | null>;
    checkLimit(subscriptionId: string, usageKey: string, periodType?: "daily" | "monthly" | "lifetime"): Promise<{
        used: number;
        policy: string;
    }>;
    resetUsage(body: {
        subscriptionId: string;
        usageKey?: string;
        periodType?: "daily" | "monthly" | "lifetime";
    }): Promise<{
        success: boolean;
    }>;
    enforceLimit(body: {
        subscriptionId: string;
        usageKey: string;
        limit: number;
        amount?: number;
        periodType?: "daily" | "monthly" | "lifetime";
        policyType?: "strict" | "fair_use" | "unlimited";
    }): Promise<{
        success: boolean;
    }>;
    getAllUsage(subscriptionId: string): Promise<SubscriptionUsage[]>;
}
