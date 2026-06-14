export declare enum PaymentMethod {
    STRIPE = "stripe",
    PAYPAL = "paypal",
    TELR = "telr",
    TAP = "tap",
    APPLE_PAY = "apple_pay",
    GOOGLE_PAY = "google_pay",
    CARD = "card",
    FREE = "free"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare class SubscriptionPayment {
    id: string;
    user_subscription_id: string;
    payment_method: PaymentMethod;
    gateway?: string;
    amount: number;
    currency?: string;
    payment_status: PaymentStatus;
    transaction_id?: string;
    order_ref?: string;
    paid_at?: Date;
    created_at: Date;
    updated_at: Date;
}
