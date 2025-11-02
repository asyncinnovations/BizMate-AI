import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentService {
  //////////////////////////////////////////////////////
  // GENERATE TELR LINK
  //////////////////////////////////////////////////////
  async generateTelrLink(credentials: any, amount: number) {
    const params = new URLSearchParams({
      method: "create",
      store: credentials.store_id,
      authkey: credentials.auth_key,
      test: "1", // set '0' in production
      order_ref: "INV" + Date.now(),
      amount: amount.toFixed(2),
      currency: credentials.currency || "AED",
      desc: "Payment for Order",
      return_auth: "https://bizmateai.com/payment/success",
      return_can: "https://bizmateai.com/payment/cancel",
      return_decl: "https://bizmateai.com/payment/decline",
    });

    const response = await fetch("https://secure.telr.com/gateway/order.json", {
      method: "POST",
      body: params,
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    return {
      gateway: "telr",
      payment_url: data.order.url,
      order_ref: data.order.ref,
    };
  }

  //////////////////////////////////////////////////////
  // GENERATE PAYPAL LINK
  //////////////////////////////////////////////////////
  async generatePayPalLink(credentials: any, amount: number) {
    const paypal = require("@paypal/checkout-server-sdk");
    const env = new paypal.core.SandboxEnvironment(
      credentials.client_id,
      credentials.client_secret
    );
    const client = new paypal.core.PayPalHttpClient(env);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
        },
      ],
    });

    const order = await client.execute(request);
    const approvalUrl = order.result.links.find(
      (link: any) => link.rel === "approve"
    ).href;

    return { gateway: "paypal", payment_url: approvalUrl };
  }

  //////////////////////////////////////////////////////
  // GENERATE STRIPE LINK
  //////////////////////////////////////////////////////
  async generateStripeLink(credentials: any, amount: number) {
    const stripe = require("stripe")(credentials.secret_key);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: { name: "Payment for Order" },
            unit_amount: amount * 100, // amount in smallest currency unit
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://bizmateai.com/success",
      cancel_url: "https://bizmateai.com/cancel",
    });

    return { gateway: "stripe", payment_url: session.url };
  }
}
