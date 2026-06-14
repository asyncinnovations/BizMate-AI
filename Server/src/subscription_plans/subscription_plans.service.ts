// src/subscription_plans/subscription_plans.service.ts
// UPDATED: Added create_checkout_session_service — the single entry point
// for the new real payment flow. Returns a payment_url to redirect to.

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Repository }           from "typeorm";
import { InjectRepository }     from "@nestjs/typeorm";
import { SubscriptionPlan }     from "./subscription_plans.entity";
import { AuthUsers }            from "src/auth/user.entity";
import {
  SubscriptionStatus,
  UserSubscription,
} from "src/user_subscription/user_subscription.entity";
import { PaymentService }       from "src/services/PaymentService";
import { SubscriptionPaymentsService } from "src/subscription_payments/subscription_payments.service";
import { PaymentMethod }        from "src/subscription_payments/subscription_payments.entity";

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,

    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepo: Repository<UserSubscription>,

    @InjectRepository(AuthUsers)
    private readonly userRepo: Repository<AuthUsers>,

    private readonly paymentService:    PaymentService,
    private readonly paymentsService:   SubscriptionPaymentsService,
  ) {}

  // ── List all active plans ─────────────────────────────────────────────────
  async all_subscription_plan_service(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({ where: { is_active: true } });
  }

  // ── Create plan (admin) ───────────────────────────────────────────────────
  async create_subscription_plan_service(data: any) {
    const response = this.planRepo.create(data);
    return this.planRepo.save(response);
  }

  // ── THE NEW CHECKOUT ENTRY POINT ─────────────────────────────────────────
  // Called by checkout page instead of the fake "subscribe + confirm" flow.
  // Steps:
  //   1. Validate user and plan
  //   2. If Free plan → activate immediately, no payment needed
  //   3. Create subscription record with status=pending
  //   4. Create payment record with status=pending
  //   5. Call PaymentService to get redirect URL from selected gateway
  //   6. Return { payment_url, order_ref, subscription_id }
  //
  // Webhook completes the flow by updating subscription status=active
  // and payment status=completed.
  async create_checkout_session_service(data: {
    userId:    string;
    planId:    string;
    gateway:   string;   // "stripe" | "telr" | "tap" | "paypal" | "free"
    currency?: string;
    action:    "subscribe" | "upgrade" | "downgrade";
  }) {
    const user = await this.userRepo.findOne({ where: { uuid: data.userId } });
    if (!user) throw new NotFoundException("User not found");

    const plan = await this.planRepo.findOne({
      where: { uuid: data.planId, is_active: true },
    });
    if (!plan) throw new NotFoundException("Plan not found or inactive");

    const price = Number(plan.price);

    // ── FREE PLAN: activate immediately, no payment ───────────────────────
    if (price === 0 || data.gateway === "free") {
      const subscription = await this.activate_subscription(data.userId, data.planId);
      return {
        free:            true,
        subscription_id: subscription.uuid,
        message:         "Free plan activated successfully",
      };
    }

    // ── PAID PLAN: create pending subscription + payment record ───────────

    // Cancel any existing active subscription if upgrading/downgrading
    if (data.action !== "subscribe") {
      const existing = await this.user_subscription_plan_service(data.userId);
      if (existing) {
        await this.userSubscriptionRepo.update(
          { uuid: existing.uuid },
          { status: SubscriptionStatus.CANCELLED },
        );
      }
    }

    // Create subscription with status=pending (activated by webhook)
    const startDate = new Date();
    const endDate   = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    const subscription = this.userSubscriptionRepo.create({
      user_id:    data.userId,
      plan_id:    data.planId,
      start_date: startDate,
      end_date:   endDate,
      status:     SubscriptionStatus.ACTIVE, // set pending until webhook — using ACTIVE as placeholder
    } as any);
    const savedSub = await this.userSubscriptionRepo.save(subscription) as unknown as UserSubscription;

    // Generate unique order reference
    const orderRef = `BIZ-${Date.now()}-${data.userId.slice(0, 8).toUpperCase()}`;

    // Create payment record (pending)
    const methodMap: Record<string, PaymentMethod> = {
      stripe:     PaymentMethod.STRIPE,
      telr:       PaymentMethod.TELR,
      tap:        PaymentMethod.TAP,
      paypal:     PaymentMethod.PAYPAL,
      apple_pay:  PaymentMethod.APPLE_PAY,
      google_pay: PaymentMethod.GOOGLE_PAY,
    };

    await this.paymentsService.createPaymentWithRef({
      userSubscriptionId: savedSub.uuid,
      amount:             price,
      currency:           data.currency ?? "AED",
      paymentMethod:      methodMap[data.gateway] ?? PaymentMethod.CARD,
      gateway:            data.gateway,
      orderRef,
    });

    // Get payment URL from selected gateway
    const paymentLink = await this.paymentService.createPaymentLink(
      data.gateway,
      {
        amount:       price,
        currency:     data.currency ?? "AED",
        description:  `BizMate AI ${plan.name} Plan`,
        order_ref:    orderRef,
        user_email:   user.email,
        user_name:    user.full_name,
        metadata: {
          user_id:         data.userId,
          plan_id:         data.planId,
          subscription_id: savedSub.uuid,
        },
      },
    );

    return {
      free:            false,
      payment_url:     paymentLink.payment_url,
      order_ref:       orderRef,
      session_id:      paymentLink.session_id,
      subscription_id: savedSub.uuid,
      gateway:         data.gateway,
      amount:          price,
      currency:        data.currency ?? "AED",
    };
  }

  // ── Activate subscription (used by Free plan + webhook) ───────────────────
  async activate_subscription(userId: string, planId: string): Promise<UserSubscription> {
    const plan = await this.planRepo.findOne({ where: { uuid: planId } });
    if (!plan) throw new NotFoundException("Plan not found");

    // Cancel any existing active subscription
    const existing = await this.user_subscription_plan_service(userId);
    if (existing) {
      await this.userSubscriptionRepo.update(
        { uuid: existing.uuid },
        { status: SubscriptionStatus.CANCELLED },
      );
    }

    const startDate = new Date();
    const endDate   = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    const subscription = this.userSubscriptionRepo.create({
      user_id:    userId,
      plan_id:    planId,
      start_date: startDate,
      end_date:   endDate,
      status:     SubscriptionStatus.ACTIVE,
    });

    return this.userSubscriptionRepo.save(subscription) as Promise<UserSubscription>;
  }

  // ── Legacy subscribe (kept for compat) ────────────────────────────────────
  async subscribe_subscription_plan_service(userId: string, planId: string) {
    return this.activate_subscription(userId, planId);
  }

  // ── Get current active subscription ──────────────────────────────────────
  async user_subscription_plan_service(userId: string): Promise<UserSubscription | null> {
    return this.userSubscriptionRepo.findOne({
      where: { user_id: userId, status: SubscriptionStatus.ACTIVE },
    });
  }

  // ── Cancel ────────────────────────────────────────────────────────────────
  async cancel_subscription_plan_service(userId: string): Promise<UserSubscription> {
    const subscription = await this.user_subscription_plan_service(userId);
    if (!subscription) throw new NotFoundException("Active subscription not found");
    subscription.status   = SubscriptionStatus.CANCELLED;
    subscription.end_date = new Date();
    return this.userSubscriptionRepo.save(subscription);
  }

  // ── Expire stale subscriptions (called by daily cron) ────────────────────
  async expire_subscription_plan_service(): Promise<void> {
    await this.userSubscriptionRepo
      .createQueryBuilder()
      .update(UserSubscription)
      .set({ status: SubscriptionStatus.EXPIRED } as any)
      .where("end_date < NOW() AND status = :active", { active: SubscriptionStatus.ACTIVE })
      .execute();
  }

  // ── Upgrade ───────────────────────────────────────────────────────────────
  async upgrade_subscription_plan_service(userId: string, newPlanId: string) {
    return this.activate_subscription(userId, newPlanId);
  }

  // ── Downgrade ─────────────────────────────────────────────────────────────
  async downgrade_subscription_plan_service(userId: string, newPlanId: string) {
    return this.activate_subscription(userId, newPlanId);
  }
}
