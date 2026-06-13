// src/subscription_payments/subscription_payments.service.ts
// UPDATED:
// 1. createPaymentWithRef — new method that sets order_ref and gateway
// 2. getPaymentByOrderRef — lookup by order_ref for webhook confirmation
// 3. getPaymentsByUser — for billing history display

import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository }                    from "typeorm";
import { InjectRepository }              from "@nestjs/typeorm";
import {
  PaymentMethod,
  PaymentStatus,
  SubscriptionPayment,
} from "./subscription_payments.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";

@Injectable()
export class SubscriptionPaymentsService {
  constructor(
    @InjectRepository(SubscriptionPayment)
    private readonly paymentRepo: Repository<SubscriptionPayment>,

    @InjectRepository(UserSubscription)
    private readonly subscriptionRepo: Repository<UserSubscription>,
  ) {}

  // ── Create payment record (sets status=pending, stores order_ref) ─────────
  async createPaymentWithRef(data: {
    userSubscriptionId: string;
    amount:             number;
    currency?:          string;
    paymentMethod:      PaymentMethod;
    gateway:            string;
    orderRef:           string;
  }): Promise<SubscriptionPayment> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { uuid: data.userSubscriptionId },
    });
    if (!subscription) throw new NotFoundException("User subscription not found");

    const payment = this.paymentRepo.create({
      user_subscription_id: subscription.uuid,
      amount:               data.amount,
      currency:             data.currency ?? "AED",
      payment_method:       data.paymentMethod,
      gateway:              data.gateway,
      payment_status:       PaymentStatus.PENDING,
      order_ref:            data.orderRef,
    });

    return this.paymentRepo.save(payment);
  }

  // ── Legacy createPayment (kept for backward compat) ───────────────────────
  async createPayment(
    userSubscriptionId: string,
    amount:             number,
    paymentMethod:      PaymentMethod,
  ): Promise<SubscriptionPayment> {
    const orderRef = `ORD-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    return this.createPaymentWithRef({
      userSubscriptionId,
      amount,
      paymentMethod,
      gateway:  paymentMethod,
      orderRef,
    });
  }

  // ── Update payment status ─────────────────────────────────────────────────
  async updatePaymentStatus(
    paymentId:     string,
    status:        PaymentStatus,
    transactionId?: string,
    paidAt?:        Date,
    gateway?:       string,
  ): Promise<SubscriptionPayment> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException("Payment not found");

    payment.payment_status = status;
    if (transactionId) payment.transaction_id = transactionId;
    if (paidAt)        payment.paid_at        = paidAt;
    if (gateway)       payment.gateway        = gateway;

    return this.paymentRepo.save(payment);
  }

  // ── Find by order_ref — used by webhook to confirm payment ────────────────
  async getPaymentByOrderRef(orderRef: string): Promise<SubscriptionPayment | null> {
    return this.paymentRepo.findOne({ where: { order_ref: orderRef } });
  }

  // ── Payments by subscription ──────────────────────────────────────────────
  async getPaymentsBySubscription(userSubscriptionId: string): Promise<SubscriptionPayment[]> {
    return this.paymentRepo.find({
      where: { user_subscription_id: userSubscriptionId },
      order: { created_at: "DESC" },
    });
  }

  // ── Payments by user (joins through user_subscriptions) ───────────────────
  async getPaymentsByUser(userId: string): Promise<SubscriptionPayment[]> {
    return this.paymentRepo
      .createQueryBuilder("sp")
      .innerJoin("user_subscriptions", "us", "us.uuid = sp.user_subscription_id")
      .where("us.user_id = :userId", { userId })
      .orderBy("sp.created_at", "DESC")
      .getMany();
  }

  // ── All payments (admin) ──────────────────────────────────────────────────
  async getAllPayments(): Promise<SubscriptionPayment[]> {
    return this.paymentRepo.find({ order: { created_at: "DESC" } });
  }
}
