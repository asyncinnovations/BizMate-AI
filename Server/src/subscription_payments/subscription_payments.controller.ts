import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { SubscriptionPaymentsService } from "./subscription_payments.service";
import { PaymentMethod, PaymentStatus } from "./subscription_payments.entity";

@Controller("subscription-payments")
export class SubscriptionPaymentsController {
  constructor(private readonly paymentsService: SubscriptionPaymentsService) {}

  ///////////////////////////////////////////
  // Create a Payment for a Subscription
  ///////////////////////////////////////////
  @Post("create/:plan_id")
  @HttpCode(HttpStatus.CREATED)
  async create_wallet_transaction(
    @Param("plan_id") subscriptionId: string,
    @Body("amount") amount: number,
    @Body("paymentMethod") paymentMethod: PaymentMethod
  ) {
    try {
      const payment = await this.paymentsService.createPayment(
        subscriptionId,
        amount,
        paymentMethod
      );
      return { success: true, payment };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Update Payment Status
  ///////////////////////////////////////////
  @Post("status/:paymentId")
  @HttpCode(HttpStatus.OK)
  async update_transaction_status(
    @Param("paymentId") paymentId: string,
    @Body("status") status: PaymentStatus,
    @Body("transactionId") transactionId?: string,
    @Body("paidAt") paidAt?: Date
  ) {
    try {
      const payment = await this.paymentsService.updatePaymentStatus(
        paymentId,
        status,
        transactionId,
        paidAt
      );
      return { success: true, payment };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Get Payments by User Subscription
  ///////////////////////////////////////////
  @Get("subscription/:subscriptionId")
  @HttpCode(HttpStatus.OK)
  async subscription_transaction(
    @Param("subscriptionId") subscriptionId: string
  ) {
    try {
      const payments =
        await this.paymentsService.getPaymentsBySubscription(subscriptionId);
      return { success: true, payments };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////
  // Get All Payments
  ///////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_wallet_transaction() {
    try {
      const payments = await this.paymentsService.getAllPayments();
      return { success: true, payments };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
