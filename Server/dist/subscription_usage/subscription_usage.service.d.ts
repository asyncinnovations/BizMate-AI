import { Repository } from "typeorm";
import { SubscriptionUsage } from "./subscription_usage.entity";
export declare class SubscriptionUsageService {
    private readonly subscriptionUsageRepo;
    constructor(subscriptionUsageRepo: Repository<SubscriptionUsage>);
    increment_usage_service(subscriptionId: string, usageKey: string, amount?: number, periodStart?: Date, periodEnd?: Date): Promise<SubscriptionUsage>;
    get_subscription_usage_serice(subscriptionId: string, usageKey: string, periodStart?: Date, periodEnd?: Date): Promise<SubscriptionUsage | null>;
    check_usage_limit_service(subscriptionId: string, usageKey: string, limit: number): Promise<boolean>;
    reset_usage_service(subscriptionId: string, usageKey?: string, periodStart?: Date, periodEnd?: Date): Promise<void>;
    all_usage_for_subscription_service(subscriptionId: string): Promise<SubscriptionUsage[]>;
    enforce_limit_service(subscriptionId: string, usageKey: string, limit: number, amount?: number): Promise<void>;
}
