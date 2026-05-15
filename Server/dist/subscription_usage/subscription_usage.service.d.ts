import { Repository } from "typeorm";
import { SubscriptionUsage } from "./subscription_usage.entity";
export declare class SubscriptionUsageService {
    private readonly subscriptionUsageRepo;
    constructor(subscriptionUsageRepo: Repository<SubscriptionUsage>);
    private getPeriodDates;
    increment_usage_service(subscriptionId: string, usageKey: string, amount?: number, options?: {
        periodType?: "daily" | "monthly" | "lifetime";
        limitSnapshot?: number;
        policyType?: "strict" | "fair_use" | "unlimited";
    }): Promise<SubscriptionUsage>;
    get_subscription_usage_service(subscriptionId: string, usageKey: string, periodType?: "daily" | "monthly" | "lifetime"): Promise<SubscriptionUsage | null>;
    check_usage_limit_service(subscriptionId: string, usageKey: string, periodType?: "daily" | "monthly" | "lifetime"): Promise<{
        used: number;
        policy: string;
    }>;
    enforce_limit_service(subscriptionId: string, usageKey: string, limit: number, amount?: number, options?: {
        periodType?: "daily" | "monthly" | "lifetime";
        policyType?: "strict" | "fair_use" | "unlimited";
    }): Promise<void>;
    reset_usage_service(subscriptionId: string, usageKey?: string, periodType?: "daily" | "monthly" | "lifetime"): Promise<void>;
    all_usage_for_subscription_service(subscriptionId: string, periodType?: "daily" | "monthly" | "lifetime"): Promise<SubscriptionUsage[]>;
}
