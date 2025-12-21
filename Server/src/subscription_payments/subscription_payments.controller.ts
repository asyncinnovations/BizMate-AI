import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { SubscriptionPaymentsService } from "./subscription_payments.service";
import { PaymentMethod, PaymentStatus } from "./subscription_payments.entity";
// import { SubscriptionPaymentsService } from "./subscription-payments.service";
// import { PaymentMethod, PaymentStatus } from "./subscription-payments.entity";

@Controller("subscription-payments")
export class SubscriptionPaymentsController {
  constructor(private readonly paymentsService: SubscriptionPaymentsService) {}

  ///////////////////////////////////////////
  // Create a Payment for a Subscription
  ///////////////////////////////////////////
  @Post(":subscriptionId/create")
  async createPayment(
    @Param("subscriptionId") subscriptionId: string,
    @Body("amount") amount: number,
    @Body("paymentMethod") paymentMethod: PaymentMethod
  ) {
    const payment = await this.paymentsService.createPayment(
      subscriptionId,
      amount,
      paymentMethod
    );
    return { success: true, payment };
  }

  ///////////////////////////////////////////
  // Update Payment Status
  ///////////////////////////////////////////
  @Post(":paymentId/status")
  async updatePaymentStatus(
    @Param("paymentId") paymentId: string,
    @Body("status") status: PaymentStatus,
    @Body("transactionId") transactionId?: string,
    @Body("paidAt") paidAt?: Date
  ) {
    const payment = await this.paymentsService.updatePaymentStatus(
      paymentId,
      status,
      transactionId,
      paidAt
    );
    return { success: true, payment };
  }

  ///////////////////////////////////////////
  // Get Payments by User Subscription
  ///////////////////////////////////////////
  @Get("subscription/:subscriptionId")
  async getPaymentsBySubscription(
    @Param("subscriptionId") subscriptionId: string
  ) {
    const payments =
      await this.paymentsService.getPaymentsBySubscription(subscriptionId);
    return { success: true, payments };
  }

  ///////////////////////////////////////////
  // Get All Payments
  ///////////////////////////////////////////
  @Get("all")
  async getAllPayments() {
    const payments = await this.paymentsService.getAllPayments();
    return { success: true, payments };
  }
}
