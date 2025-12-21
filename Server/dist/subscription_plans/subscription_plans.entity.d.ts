export declare enum PlanName {
    TRIAL = "Trial",
    STARTER = "Starter",
    STANDARD = "Standard",
    PREMIUM = "Premium"
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
