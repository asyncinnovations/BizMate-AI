export declare class PaymentService {
    generateTelrLink(credentials: any, amount: number): Promise<{
        gateway: string;
        payment_url: any;
        order_ref: any;
    }>;
    generatePayPalLink(credentials: any, amount: number): Promise<{
        gateway: string;
        payment_url: any;
    }>;
    generateStripeLink(credentials: any, amount: number): Promise<{
        gateway: string;
        payment_url: any;
    }>;
}
