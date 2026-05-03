export declare enum PlanName {
    STARTUP = "Startup",
    STARTER = "Starter",
    PRO = "Pro",
    ENTERPRISE = "Enterprise"
}
export declare class SubscriptionPlan {
    id: number;
    uuid: string;
    name: PlanName;
    description?: string;
    features?: Record<string, any>;
    price: number;
    duration_days: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
