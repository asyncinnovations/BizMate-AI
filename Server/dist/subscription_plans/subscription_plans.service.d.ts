import { Repository } from "typeorm";
import { SubscriptionPlan } from "./subscription_plans.entity";
import { AuthUsers } from "src/auth/user.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
import { PaymentService } from "src/services/PaymentService";
import { SubscriptionPaymentsService } from "src/subscription_payments/subscription_payments.service";
export declare class SubscriptionPlanService {
    private readonly planRepo;
    private readonly userSubscriptionRepo;
    private readonly userRepo;
    private readonly paymentService;
    private readonly paymentsService;
    constructor(planRepo: Repository<SubscriptionPlan>, userSubscriptionRepo: Repository<UserSubscription>, userRepo: Repository<AuthUsers>, paymentService: PaymentService, paymentsService: SubscriptionPaymentsService);
    all_subscription_plan_service(): Promise<SubscriptionPlan[]>;
    create_subscription_plan_service(data: any): Promise<SubscriptionPlan[]>;
    create_checkout_session_service(data: {
        userId: string;
        planId: string;
        gateway: string;
        currency?: string;
        action: "subscribe" | "upgrade" | "downgrade";
    }): Promise<{
        free: boolean;
        subscription_id: string;
        message: string;
        payment_url?: undefined;
        order_ref?: undefined;
        session_id?: undefined;
        gateway?: undefined;
        amount?: undefined;
        currency?: undefined;
    } | {
        free: boolean;
        payment_url: string;
        order_ref: string;
        session_id: string | undefined;
        subscription_id: string;
        gateway: string;
        amount: number;
        currency: string;
        message?: undefined;
    }>;
    activate_subscription(userId: string, planId: string): Promise<UserSubscription>;
    subscribe_subscription_plan_service(userId: string, planId: string): Promise<UserSubscription>;
    user_subscription_plan_service(userId: string): Promise<UserSubscription | null>;
    cancel_subscription_plan_service(userId: string): Promise<UserSubscription>;
    expire_subscription_plan_service(): Promise<void>;
    upgrade_subscription_plan_service(userId: string, newPlanId: string): Promise<UserSubscription>;
    downgrade_subscription_plan_service(userId: string, newPlanId: string): Promise<UserSubscription>;
}
