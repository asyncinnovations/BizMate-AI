import { SubscriptionPaymentsService } from "./subscription_payments.service";
import { PaymentMethod, PaymentStatus } from "./subscription_payments.entity";
export declare class SubscriptionPaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: SubscriptionPaymentsService);
    createPayment(subscriptionId: string, amount: number, paymentMethod: PaymentMethod): Promise<{
        success: boolean;
        payment: import("./subscription_payments.entity").SubscriptionPayment;
    }>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string, paidAt?: Date): Promise<{
        success: boolean;
        payment: import("./subscription_payments.entity").SubscriptionPayment;
    }>;
    getPaymentsBySubscription(subscriptionId: string): Promise<{
        success: boolean;
        payments: import("./subscription_payments.entity").SubscriptionPayment[];
    }>;
    getAllPayments(): Promise<{
        success: boolean;
        payments: import("./subscription_payments.entity").SubscriptionPayment[];
    }>;
}
