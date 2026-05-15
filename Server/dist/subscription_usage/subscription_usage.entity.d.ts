export declare class SubscriptionUsage {
    id: string;
    subscriptionId: string;
    usageKey: string;
    used: number;
    periodType: "daily" | "monthly" | "lifetime";
    periodStart: Date;
    periodEnd: Date;
    limitSnapshot?: number;
    resetKey?: string;
    policyType?: "strict" | "fair_use" | "unlimited";
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
