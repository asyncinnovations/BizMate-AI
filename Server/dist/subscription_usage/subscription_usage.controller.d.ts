import { SubscriptionUsage } from "./subscription_usage.entity";
import { SubscriptionUsageService } from "./subscription_usage.service";
export declare class SubscriptionUsageController {
    private readonly usageService;
    constructor(usageService: SubscriptionUsageService);
    incrementUsage(body: {
        subscriptionId: string;
        usageKey: string;
        amount?: number;
    }): Promise<SubscriptionUsage>;
    getUsage(subscriptionId: string, usageKey: string): Promise<SubscriptionUsage | null>;
    checkLimit(subscriptionId: string, usageKey: string, limit: number): Promise<{
        exceeded: boolean;
    }>;
    resetUsage(body: {
        subscriptionId: string;
        usageKey?: string;
    }): Promise<{
        success: boolean;
    }>;
    getAllUsage(subscriptionId: string): Promise<SubscriptionUsage[]>;
    enforceLimit(body: {
        subscriptionId: string;
        usageKey: string;
        limit: number;
        amount?: number;
    }): Promise<{
        success: boolean;
    }>;
}
