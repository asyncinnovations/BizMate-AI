import { Repository } from "typeorm";
import { PaymentMethod, PaymentStatus, SubscriptionPayment } from "./subscription_payments.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
export declare class SubscriptionPaymentsService {
    private readonly paymentRepo;
    private readonly subscriptionRepo;
    constructor(paymentRepo: Repository<SubscriptionPayment>, subscriptionRepo: Repository<UserSubscription>);
    createPaymentWithRef(data: {
        userSubscriptionId: string;
        amount: number;
        currency?: string;
        paymentMethod: PaymentMethod;
        gateway: string;
        orderRef: string;
    }): Promise<SubscriptionPayment>;
    createPayment(userSubscriptionId: string, amount: number, paymentMethod: PaymentMethod): Promise<SubscriptionPayment>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string, paidAt?: Date, gateway?: string): Promise<SubscriptionPayment>;
    getPaymentByOrderRef(orderRef: string): Promise<SubscriptionPayment | null>;
    getPaymentsBySubscription(userSubscriptionId: string): Promise<SubscriptionPayment[]>;
    getPaymentsByUser(userId: string): Promise<SubscriptionPayment[]>;
    getAllPayments(): Promise<SubscriptionPayment[]>;
}
