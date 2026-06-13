// src/webhooks/webhooks.controller.ts
// Handles incoming payment callbacks from all gateways.
// This is the only place where payment status should be updated to "completed".
//
// ROUTES:
//   POST /api/webhooks/stripe        — Stripe sends events here
//   GET  /api/webhooks/telr/success  — Telr redirects browser here on payment success
//   GET  /api/webhooks/telr/decline  — Telr redirects browser here on decline
//   POST /api/webhooks/tap           — Tap posts here on payment event
//   GET  /api/webhooks/paypal/capture — captures PayPal order after user approves
//
// STRIPE SETUP:
//   1. Go to Stripe Dashboard → Developers → Webhooks
//   2. Add endpoint: https://app.bizmate.ai/api/webhooks/stripe
//   3. Select events: checkout.session.completed, payment_intent.payment_failed
//   4. Copy the signing secret → set as STRIPE_WEBHOOK_SECRET in env

import {
  Controller, Post, Get, Req, Res, Param, Query, Body,
  Headers, HttpCode, HttpStatus, RawBodyRequest,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SubscriptionPaymentsService } from "src/subscription_payments/subscription_payments.service";
import { SubscriptionPlanService }     from "src/subscription_plans/subscription_plans.service";
import { PaymentStatus }               from "src/subscription_payments/subscription_payments.entity";
import { pool }                        from "src/config/db";
import { ResendService, EmailTemplates } from "src/services/ResendService";
import { NotificationType }            from "src/notifications/notifications.entity";

@Controller("webhooks")
export class WebhooksController {
  constructor(
    private readonly paymentsService: SubscriptionPaymentsService,
    private readonly planService:     SubscriptionPlanService,
    private readonly resendService:   ResendService,
  ) {}

  // ── STRIPE webhook ────────────────────────────────────────────────────────
  // Stripe signs every event with STRIPE_WEBHOOK_SECRET.
  // We MUST verify the signature before trusting the payload.
  @Post("stripe")
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(
    @Req()     req: RawBodyRequest<Request>,
    @Res()     res: Response,
    @Headers("stripe-signature") sig: string,
  ) {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY ?? "");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

    let event: any;
    try {
      // Raw body required for signature verification — configure in main.ts:
      // app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error("[Stripe Webhook] Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[Stripe Webhook] Event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderRef = session.metadata?.order_ref;

      if (!orderRef) {
        console.warn("[Stripe Webhook] No order_ref in metadata");
        return res.json({ received: true });
      }

      try {
        await this.confirmPaymentByOrderRef(
          orderRef,
          session.payment_intent ?? session.id,
          "stripe",
        );
        console.log(`[Stripe Webhook] ✓ Payment confirmed for ${orderRef}`);
      } catch (err: any) {
        console.error("[Stripe Webhook] Confirm failed:", err.message);
      }
    }

    if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
      const session = event.data.object;
      const orderRef = session.metadata?.order_ref;
      if (orderRef) {
        await this.failPaymentByOrderRef(orderRef);
        console.log(`[Stripe Webhook] ✗ Payment failed for ${orderRef}`);
      }
    }

    return res.json({ received: true });
  }

  // ── TELR success callback ─────────────────────────────────────────────────
  // Telr redirects the user's browser to return_auth URL after successful payment.
  // Also POSTs an IPN (instant payment notification) separately — not implemented here.
  @Get("telr/success")
  async telrSuccess(
    @Query("order_ref") orderRef: string,
    @Query("tran_ref")  tranRef:  string,
    @Res() res: Response,
  ) {
    if (!orderRef) {
      return res.redirect(`${process.env.APP_URL}/dashboard/payment/cancel`);
    }

    try {
      // Verify payment with Telr API before confirming
      const verified = await this.verifyTelrPayment(orderRef);
      if (verified) {
        await this.confirmPaymentByOrderRef(orderRef, tranRef ?? orderRef, "telr");
        console.log(`[Telr Webhook] ✓ Payment confirmed for ${orderRef}`);
      }
    } catch (err: any) {
      console.error("[Telr Webhook] Error:", err.message);
    }

    // Redirect browser to success page
    return res.redirect(`${process.env.APP_URL}/dashboard/payment/success?order_ref=${orderRef}&gateway=telr`);
  }

  @Get("telr/decline")
  async telrDecline(@Query("order_ref") orderRef: string, @Res() res: Response) {
    if (orderRef) await this.failPaymentByOrderRef(orderRef);
    return res.redirect(`${process.env.APP_URL}/dashboard/payment/cancel?order_ref=${orderRef}`);
  }

  // ── TAP webhook ───────────────────────────────────────────────────────────
  @Post("tap")
  @HttpCode(HttpStatus.OK)
  async tapWebhook(@Body() body: any) {
    console.log("[Tap Webhook] Event:", body?.status, body?.id);

    if (body?.status === "CAPTURED" || body?.status === "AUTHORIZED") {
      const orderRef = body?.reference?.order ?? body?.metadata?.order_ref;
      if (orderRef) {
        await this.confirmPaymentByOrderRef(orderRef, body.id, "tap");
        console.log(`[Tap Webhook] ✓ Payment confirmed for ${orderRef}`);
      }
    }

    if (body?.status === "FAILED" || body?.status === "DECLINED") {
      const orderRef = body?.reference?.order ?? body?.metadata?.order_ref;
      if (orderRef) await this.failPaymentByOrderRef(orderRef);
    }

    return { received: true };
  }

  // ── PAYPAL capture callback ───────────────────────────────────────────────
  // After user approves on PayPal, they're redirected here with token + PayerID
  @Get("paypal/capture")
  async paypalCapture(
    @Query("token")     token:     string,
    @Query("PayerID")   payerId:   string,
    @Query("order_ref") orderRef:  string,
    @Res() res: Response,
  ) {
    if (!token) {
      return res.redirect(`${process.env.APP_URL}/dashboard/payment/cancel`);
    }

    try {
      const mode    = process.env.PAYPAL_MODE ?? "sandbox";
      const baseUrl = mode === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

      // Get access token
      const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method:  "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
      const { access_token } = await tokenRes.json() as any;

      // Capture the order
      const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${token}/capture`, {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type":  "application/json",
        },
      });
      const captureData = await captureRes.json() as any;

      if (captureData.status === "COMPLETED") {
        const ref = orderRef ?? captureData.id;
        await this.confirmPaymentByOrderRef(ref, captureData.id, "paypal");
        console.log(`[PayPal] ✓ Payment captured for ${ref}`);
      }
    } catch (err: any) {
      console.error("[PayPal Capture] Error:", err.message);
    }

    return res.redirect(
      `${process.env.APP_URL}/dashboard/payment/success?gateway=paypal&order_ref=${orderRef ?? token}`
    );
  }

  // ── Core: confirm payment + activate subscription ─────────────────────────
  private async confirmPaymentByOrderRef(
    orderRef:    string,
    txnId:       string,
    gateway:     string,
  ) {
    // Find the payment record by order_ref stored in metadata column
    const { rows } = await pool.query<{
      id:                   string;
      user_subscription_id: string;
      amount:               number;
      user_id?:             string;
    }>(
      `SELECT sp.id, sp.user_subscription_id, sp.amount,
              us.user_id
       FROM subscription_payments sp
       JOIN user_subscriptions us ON us.uuid = sp.user_subscription_id
       WHERE sp.order_ref = $1
       LIMIT 1`,
      [orderRef],
    );

    if (!rows.length) {
      console.warn(`[Webhook] No payment found for order_ref: ${orderRef}`);
      return;
    }

    const payment = rows[0];

    // 1. Mark payment completed
    await pool.query(
      `UPDATE subscription_payments
       SET payment_status = 'completed', transaction_id = $1, paid_at = NOW(), gateway = $2, updated_at = NOW()
       WHERE id = $3`,
      [txnId, gateway, payment.id],
    );

    // 2. Activate subscription
    await pool.query(
      `UPDATE user_subscriptions
       SET status = 'active', updated_at = NOW()
       WHERE uuid = $1`,
      [payment.user_subscription_id],
    );

    // 3. Send payment confirmation email
    if (payment.user_id) {
      try {
        const { rows: userRows } = await pool.query(
          `SELECT email, full_name FROM users WHERE uuid = $1`,
          [payment.user_id],
        );
        const u = userRows[0];
        if (u?.email) {
          await this.resendService.send({
            to:      u.email,
            subject: "✅ BizMate AI — Payment Confirmed",
            html:    EmailTemplates.invoicePaid({
              invoice_number: orderRef,
              customer_name:  "BizMate AI",
              total:          payment.amount,
              full_name:      u.full_name,
            }),
          });

          // 4. Write dashboard notification
          await pool.query(
            `INSERT INTO notifications
               (uuid, user_id, event_type, notification_type, title, message, status, is_read, created_at, updated_at)
             VALUES
               (gen_random_uuid(), $1, 'invoice_paid', 'dashboard', $2, $3, 'sent', false, NOW(), NOW())`,
            [
              payment.user_id,
              "Payment confirmed",
              `Payment of AED ${payment.amount} confirmed via ${gateway}. Your plan is now active.`,
            ],
          );
        }
      } catch (e: any) {
        console.error("[Webhook] Email/notification error:", e.message);
      }
    }
  }

  // ── Core: fail payment ────────────────────────────────────────────────────
  private async failPaymentByOrderRef(orderRef: string) {
    await pool.query(
      `UPDATE subscription_payments
       SET payment_status = 'failed', updated_at = NOW()
       WHERE order_ref = $1`,
      [orderRef],
    );
  }

  // ── Telr payment verification ─────────────────────────────────────────────
  private async verifyTelrPayment(orderRef: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        method:  "check",
        store:   process.env.TELR_STORE_ID  ?? "",
        authkey: process.env.TELR_AUTH_KEY  ?? "",
        order:   orderRef,
      });
      const res  = await fetch("https://secure.telr.com/gateway/order.json", { method: "POST", body: params });
      const data = await res.json() as any;
      return data?.order?.status?.code === "A"; // "A" = Authorised
    } catch {
      return false;
    }
  }
}
