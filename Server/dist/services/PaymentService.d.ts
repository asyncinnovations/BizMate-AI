export interface PaymentOrder {
    amount: number;
    currency?: string;
    description: string;
    order_ref: string;
    user_email?: string;
    user_name?: string;
    user_phone?: string;
    metadata?: Record<string, string>;
}
export interface PaymentLink {
    gateway: string;
    payment_url: string;
    order_ref: string;
    session_id?: string;
}
export declare class PaymentService {
    private get appUrl();
    generateStripeLink(order: PaymentOrder): Promise<PaymentLink>;
    generateTelrLink(order: PaymentOrder): Promise<PaymentLink>;
    generateTapLink(order: PaymentOrder): Promise<PaymentLink>;
    generatePayPalLink(order: PaymentOrder): Promise<PaymentLink>;
    createPaymentLink(gateway: string, order: PaymentOrder, credentials?: Record<string, string>): Promise<PaymentLink>;
}
