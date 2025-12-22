export declare enum SubscriptionStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
export declare class UserSubscription {
    id: number;
    uuid: string;
    user_id: string;
    plan_id: string;
    start_date: Date;
    end_date: Date;
    status: SubscriptionStatus;
    created_at: Date;
    updated_at: Date;
}
