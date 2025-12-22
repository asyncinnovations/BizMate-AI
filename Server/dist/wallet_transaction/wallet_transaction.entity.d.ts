export declare class WalletTransaction {
    id: number;
    uuid: string;
    user_id: string;
    transaction_type: "credit" | "debit" | "subscription_purchase" | "refund";
    amount: number;
    currency: string;
    payment_method: string;
    subscription_id: number | null;
    status: "pending" | "success" | "failed" | "refunded";
    reference_no: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}
