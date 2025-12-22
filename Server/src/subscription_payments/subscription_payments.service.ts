import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  PaymentMethod,
  PaymentStatus,
  SubscriptionPayment,
} from "./subscription_payments.entity";
import { UserSubscription } from "src/user_subscription/user_subscription.entity";
// import {
//   SubscriptionPayment,
//   PaymentStatus,
//   PaymentMethod,
// } from "./subscription-payments.entity";
// import { UserSubscription } from "./user-subscriptions.entity";

@Injectable()
export class SubscriptionPaymentsService {
  constructor(
    @InjectRepository(SubscriptionPayment)
    private readonly paymentRepo: Repository<SubscriptionPayment>,
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepo: Repository<UserSubscription>
  ) {}

  ///////////////////////////////////////////
  // Create a Payment for a Subscription
  ///////////////////////////////////////////
  async createPayment(
    userSubscriptionId: string,
    amount: number,
    paymentMethod: PaymentMethod
  ): Promise<SubscriptionPayment> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { uuid: userSubscriptionId },
    });
    const txnid: any = Math.floor(Math.random() * 9999999999);
    if (!subscription)
      throw new NotFoundException("User subscription not found");
    const payment = this.paymentRepo.create({
      user_subscription_id: subscription.uuid,
      amount,
      payment_method: paymentMethod,
      payment_status: PaymentStatus.PENDING,
      transaction_id: txnid,
      paid_at: new Date().toISOString(),
    });

    return this.paymentRepo.save(payment);
  }

  ///////////////////////////////////////////
  // Update Payment Status
  ///////////////////////////////////////////
  async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    transactionId?: string,
    paidAt?: Date
  ): Promise<SubscriptionPayment> {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
    });
    if (!payment) throw new NotFoundException("Payment not found");

    payment.payment_status = status;
    if (transactionId) payment.transaction_id = transactionId;
    if (paidAt) payment.paid_at = paidAt;

    return this.paymentRepo.save(payment);
  }

  ///////////////////////////////////////////
  // Get Payments by User Subscription
  ///////////////////////////////////////////
  async getPaymentsBySubscription(
    userSubscriptionId: string
  ): Promise<SubscriptionPayment[]> {
    return this.paymentRepo.find({
      where: { user_subscription_id: userSubscriptionId },
      // relations: ["user_subscriptions"],
    });
  }

  ///////////////////////////////////////////
  // Get All Payments
  ///////////////////////////////////////////
  async getAllPayments(): Promise<SubscriptionPayment[]> {
    return this.paymentRepo.find();
  }
}
