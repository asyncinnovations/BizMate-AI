import { Repository } from "typeorm";
import { PaymentMethod, PaymentStatus, SubscriptionPayment } from "./subscription_payments.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
export declare class SubscriptionPaymentsService {
    private readonly paymentRepo;
    private readonly subscriptionRepo;
    constructor(paymentRepo: Repository<SubscriptionPayment>, subscriptionRepo: Repository<UserSubscription>);
    createPayment(userSubscriptionId: string, amount: number, paymentMethod: PaymentMethod): Promise<SubscriptionPayment>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string, paidAt?: Date): Promise<SubscriptionPayment>;
    getPaymentsBySubscription(userSubscriptionId: string): Promise<SubscriptionPayment[]>;
    getAllPayments(): Promise<SubscriptionPayment[]>;
}
