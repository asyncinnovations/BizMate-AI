// src/services/PaymentService.ts
// COMPLETE REWRITE — Global payment gateway service.
// Supports: Stripe (cards + Apple Pay + Google Pay), Telr (UAE primary),
//           Tap Payments (GCC), PayPal (fixed — uses REST API not SDK).
//
// Architecture: Each method takes provider credentials + order data and returns:
//   { gateway, payment_url, order_ref, session_id? }
// The caller redirects the user to payment_url.
// After payment, the gateway posts to the webhook endpoint.
//
// ENV VARS NEEDED:
//   STRIPE_SECRET_KEY        — your Stripe secret key (sk_live_xxx or sk_test_xxx)
//   STRIPE_WEBHOOK_SECRET    — from Stripe Dashboard → Webhooks
//   TELR_STORE_ID            — from Telr merchant portal
//   TELR_AUTH_KEY            — from Telr merchant portal
//   TELR_TEST_MODE           — "1" for test, "0" for live
//   TAP_SECRET_KEY           — from Tap Payments dashboard
//   APP_URL                  — https://app.bizmate.ai (no trailing slash)
//   PAYPAL_CLIENT_ID         — from PayPal Developer Console
//   PAYPAL_CLIENT_SECRET     — from PayPal Developer Console
//   PAYPAL_MODE              — "sandbox" | "live"

import { Injectable, BadRequestException } from "@nestjs/common";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface PaymentOrder {
  amount:         number;           // in AED (or USD for PayPal)
  currency?:      string;           // default "AED"
  description:    string;           // e.g. "BizMate AI Starter Plan"
  order_ref:      string;           // unique order ID (e.g. "SUB-1234567890")
  user_email?:    string;
  user_name?:     string;
  user_phone?:    string;
  metadata?:      Record<string, string>; // passed through to webhook
}

export interface PaymentLink {
  gateway:     string;
  payment_url: string;
  order_ref:   string;
  session_id?: string;   // Stripe session ID — used to verify webhook
}

// ─── Service ──────────────────────────────────────────────────────────────────
@Injectable()
export class PaymentService {

  private get appUrl() {
    return process.env.APP_URL ?? "https://app.bizmate.ai";
  }

  // ── 1. STRIPE ──────────────────────────────────────────────────────────────
  // Stripe Checkout handles card, Apple Pay, Google Pay automatically.
  // Apple Pay / Google Pay appear automatically when the browser/device supports them.
  // No extra configuration needed — Stripe detects the capability.
  async generateStripeLink(order: PaymentOrder): Promise<PaymentLink> {
    const stripe = require("stripe")(
      process.env.STRIPE_SECRET_KEY ?? "",
      { apiVersion: "2024-04-10" }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],   // Apple Pay + Google Pay are automatic via card
      customer_email: order.user_email ?? undefined,
      line_items: [{
        price_data: {
          currency:     (order.currency ?? "AED").toLowerCase(),
          product_data: {
            name:        order.description,
            description: `Order ref: ${order.order_ref}`,
          },
          unit_amount: Math.round(order.amount * 100), // Stripe uses smallest currency unit
        },
        quantity: 1,
      }],
      // Return URL — frontend payment success/cancel pages
      success_url: `${this.appUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}&order_ref=${order.order_ref}`,
      cancel_url:  `${this.appUrl}/dashboard/payment/cancel?order_ref=${order.order_ref}`,
      // Metadata passed to webhook
      metadata: {
        order_ref:   order.order_ref,
        gateway:     "stripe",
        ...order.metadata,
      },
    });

    return {
      gateway:     "stripe",
      payment_url: session.url,
      order_ref:   order.order_ref,
      session_id:  session.id,
    };
  }

  // ── 2. TELR (UAE Primary) ─────────────────────────────────────────────────
  // Telr is the most widely adopted UAE payment gateway.
  // Supports Visa, Mastercard, Mada (Saudi), AMEX, Apple Pay, Samsung Pay.
  // Returns a redirect URL to the hosted payment page.
  async generateTelrLink(order: PaymentOrder): Promise<PaymentLink> {
    const storeId  = process.env.TELR_STORE_ID  ?? "";
    const authKey  = process.env.TELR_AUTH_KEY  ?? "";
    const testMode = process.env.TELR_TEST_MODE ?? "1"; // "1" = test, "0" = live

    if (!storeId || !authKey) {
      throw new BadRequestException(
        "Telr credentials not configured. Set TELR_STORE_ID and TELR_AUTH_KEY in env."
      );
    }

    const params = new URLSearchParams({
      method:       "create",
      store:        storeId,
      authkey:      authKey,
      test:         testMode,
      order_ref:    order.order_ref,
      amount:       order.amount.toFixed(2),
      currency:     order.currency ?? "AED",
      desc:         order.description,
      // Callback URLs — backend receives POST on auth/decline/cancel
      return_auth:  `${this.appUrl}/api/webhooks/telr/success?order_ref=${order.order_ref}`,
      return_decl:  `${this.appUrl}/api/webhooks/telr/decline?order_ref=${order.order_ref}`,
      return_can:   `${this.appUrl}/dashboard/payment/cancel?order_ref=${order.order_ref}`,
      // Billing info (helps with Apple Pay pre-fill)
      ...(order.user_email ? { bill_email: order.user_email } : {}),
      ...(order.user_name  ? { bill_fname: order.user_name.split(" ")[0], bill_sname: order.user_name.split(" ").slice(1).join(" ") } : {}),
      ...(order.user_phone ? { bill_tel: order.user_phone } : {}),
    });

    const response = await fetch("https://secure.telr.com/gateway/order.json", {
      method: "POST",
      body:   params,
    });

    const data = await response.json() as any;

    if (data.error) {
      throw new BadRequestException(`Telr error: ${data.error.message ?? JSON.stringify(data.error)}`);
    }

    return {
      gateway:     "telr",
      payment_url: data.order.url,
      order_ref:   data.order.ref ?? order.order_ref,
    };
  }

  // ── 3. TAP PAYMENTS (GCC — UAE, Saudi, Kuwait, Bahrain) ──────────────────
  // Tap is the fastest-growing GCC gateway.
  // Supports: Visa, MC, AMEX, Mada (SA), KNET (KW), Benefit Pay (BH), Apple Pay, Google Pay.
  // Uses simple REST API — no SDK needed.
  async generateTapLink(order: PaymentOrder): Promise<PaymentLink> {
    const secretKey = process.env.TAP_SECRET_KEY ?? "";

    if (!secretKey) {
      throw new BadRequestException("Tap Payments not configured. Set TAP_SECRET_KEY in env.");
    }

    const body = {
      amount:      order.amount,
      currency:    order.currency ?? "AED",
      threeDSecure: true,
      save_card:   false,
      description: order.description,
      metadata:    { order_ref: order.order_ref, ...(order.metadata ?? {}) },
      reference:   { transaction: order.order_ref, order: order.order_ref },
      receipt:     { email: true, sms: false },
      customer:    {
        first_name: order.user_name?.split(" ")[0] ?? "Customer",
        last_name:  order.user_name?.split(" ").slice(1).join(" ") ?? "",
        email:      order.user_email ?? undefined,
        phone: order.user_phone ? {
          country_code: "+971",
          number:       order.user_phone.replace(/^\+971/, "").replace(/\D/g, ""),
        } : undefined,
      },
      merchant:    { id: "" }, // Tap auto-fills from API key
      source:      { id: "src_all" }, // accepts all payment methods including Apple/Google Pay
      post:        { url: `${this.appUrl}/api/webhooks/tap` },
      redirect:    { url: `${this.appUrl}/dashboard/payment/success?order_ref=${order.order_ref}` },
    };

    const response = await fetch("https://api.tap.company/v2/charges", {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json() as any;

    if (data.errors || data.http_code >= 400) {
      throw new BadRequestException(
        `Tap error: ${data.errors?.[0]?.description ?? JSON.stringify(data)}`
      );
    }

    // Tap returns the redirect URL in transaction.url
    const paymentUrl = data.transaction?.url ?? data.redirect?.url;

    if (!paymentUrl) {
      throw new BadRequestException("Tap did not return a payment URL.");
    }

    return {
      gateway:     "tap",
      payment_url: paymentUrl,
      order_ref:   data.id ?? order.order_ref,
      session_id:  data.id,
    };
  }

  // ── 4. PAYPAL (fixed — uses REST API, not the broken SDK) ────────────────
  // The old implementation used @paypal/checkout-server-sdk which isn't installed.
  // This version uses PayPal's REST API v2 directly via fetch — no SDK needed.
  async generatePayPalLink(order: PaymentOrder): Promise<PaymentLink> {
    const clientId     = process.env.PAYPAL_CLIENT_ID     ?? "";
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? "";
    const mode         = process.env.PAYPAL_MODE          ?? "sandbox";

    if (!clientId || !clientSecret) {
      throw new BadRequestException("PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in env.");
    }

    const baseUrl = mode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    // Step 1: Get access token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method:  "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type":  "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json() as any;
    if (!tokenData.access_token) {
      throw new BadRequestException("Failed to authenticate with PayPal.");
    }

    // Step 2: Create order
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type":  "application/json",
        "PayPal-Request-Id": order.order_ref,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: order.order_ref,
          description:  order.description,
          amount: {
            currency_code: order.currency ?? "USD", // PayPal AED support varies by account
            value:         order.amount.toFixed(2),
          },
        }],
        application_context: {
          brand_name:  "BizMate AI",
          locale:      "en-AE",
          landing_page:"NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url:  `${this.appUrl}/dashboard/payment/success?gateway=paypal&order_ref=${order.order_ref}`,
          cancel_url:  `${this.appUrl}/dashboard/payment/cancel?order_ref=${order.order_ref}`,
        },
      }),
    });

    const orderData = await orderRes.json() as any;
    if (orderData.name === "INVALID_REQUEST" || !orderData.id) {
      throw new BadRequestException(`PayPal order creation failed: ${JSON.stringify(orderData)}`);
    }

    const approvalUrl = orderData.links?.find((l: any) => l.rel === "approve")?.href;
    if (!approvalUrl) {
      throw new BadRequestException("PayPal did not return an approval URL.");
    }

    return {
      gateway:     "paypal",
      payment_url: approvalUrl,
      order_ref:   orderData.id,
      session_id:  orderData.id,
    };
  }

  // ── Gateway router — called by the unified checkout endpoint ────────────
  async createPaymentLink(
    gateway: string,
    order:   PaymentOrder,
    credentials?: Record<string, string>,
  ): Promise<PaymentLink> {
    switch (gateway.toLowerCase()) {
      case "stripe": return this.generateStripeLink(order);
      case "telr":   return this.generateTelrLink(order);
      case "tap":    return this.generateTapLink(order);
      case "paypal": return this.generatePayPalLink(order);
      default:       throw new BadRequestException(`Unsupported gateway: ${gateway}`);
    }
  }
}
