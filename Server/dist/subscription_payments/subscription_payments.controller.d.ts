import { SubscriptionPaymentsService } from "./subscription_payments.service";
import { PaymentMethod, PaymentStatus } from "./subscription_payments.entity";
export declare class SubscriptionPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: SubscriptionPaymentsService);
    create_wallet_transaction(subscriptionId: string, amount: number, paymentMethod: PaymentMethod): Promise<{
        success: boolean;
        payment: import("./subscription_payments.entity").SubscriptionPayment;
    }>;
    update_transaction_status(paymentId: string, status: PaymentStatus, transactionId?: string, paidAt?: Date): Promise<{
        success: boolean;
        payment: import("./subscription_payments.entity").SubscriptionPayment;
    }>;
    subscription_transaction(subscriptionId: string): Promise<{
        success: boolean;
        payments: import("./subscription_payments.entity").SubscriptionPayment[];
    }>;
    all_wallet_transaction(): Promise<{
        success: boolean;
        payments: import("./subscription_payments.entity").SubscriptionPayment[];
    }>;
}
