export declare enum PaymentMethod {
    STRIPE = "stripe",
    PAYPAL = "paypal",
    CARD = "card"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class SubscriptionPayment {
    id: string;
    user_subscription_id: string;
    payment_method: PaymentMethod;
    amount: number;
    payment_status: PaymentStatus;
    transaction_id?: string;
    paid_at?: Date;
    created_at: Date;
}
