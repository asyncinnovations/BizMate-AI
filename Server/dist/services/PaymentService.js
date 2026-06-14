"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
let PaymentService = class PaymentService {
    get appUrl() {
        return process.env.APP_URL ?? "https://app.bizmate.ai";
    }
    async generateStripeLink(order) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY ?? "", { apiVersion: "2024-04-10" });
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: order.user_email ?? undefined,
            line_items: [{
                    price_data: {
                        currency: (order.currency ?? "AED").toLowerCase(),
                        product_data: {
                            name: order.description,
                            description: `Order ref: ${order.order_ref}`,
                        },
                        unit_amount: Math.round(order.amount * 100),
                    },
                    quantity: 1,
                }],
            success_url: `${this.appUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}&order_ref=${order.order_ref}`,
            cancel_url: `${this.appUrl}/dashboard/payment/cancel?order_ref=${order.order_ref}`,
            metadata: {
                order_ref: order.order_ref,
                gateway: "stripe",
                ...order.metadata,
            },
        });
        return {
            gateway: "stripe",
            payment_url: session.url,
            order_ref: order.order_ref,
            session_id: session.id,
        };
    }
    async generateTelrLink(order) {
        const storeId = process.env.TELR_STORE_ID ?? "";
        const authKey = process.env.TELR_AUTH_KEY ?? "";
        const testMode = process.env.TELR_TEST_MODE ?? "1";
        if (!storeId || !authKey) {
            throw new common_1.BadRequestException("Telr credentials not configured. Set TELR_STORE_ID and TELR_AUTH_KEY in env.");
        }
        const params = new URLSearchParams({
            method: "create",
            store: storeId,
            authkey: authKey,
            test: testMode,
            order_ref: order.order_ref,
            amount: order.amount.toFixed(2),
            currency: order.currency ?? "AED",
            desc: order.description,
            return_auth: `${this.appUrl}/api/webhooks/telr/success?order_ref=${order.order_ref}`,
            return_decl: `${this.appUrl}/api/webhooks/telr/decline?order_ref=${order.order_ref}`,
            return_can: `${this.appUrl}/dashboard/payment/cancel?order_ref=${order.order_ref}`,
            ...(order.user_email ? { bill_email: order.user_email } : {}),
            ...(order.user_name ? { bill_fname: order.user_name.split(" ")[0], bill_sname: order.user_name.split(" ").slice(1).join(" ") } : {}),
            ...(order.user_phone ? { bill_tel: order.user_phone } : {}),
        });
        const response = await fetch("https://secure.telr.com/gateway/order.json", {
            method: "POST",
            body: params,
        });
        const data = await response.json();
        if (data.error) {
            throw new common_1.BadRequestException(`Telr error: ${data.error.message ?? JSON.stringify(data.error)}`);
        }
        return {
            gateway: "telr",
            payment_url: data.order.url,
            order_ref: data.order.ref ?? order.order_ref,
        };
    }
    async generateTapLink(order) {
        const secretKey = process.env.TAP_SECRET_KEY ?? "";
        if (!secretKey) {
            throw new common_1.BadRequestException("Tap Payments not configured. Set TAP_SECRET_KEY in env.");
        }
        const body = {
            amount: order.amount,
            currency: order.currency ?? "AED",
            threeDSecure: true,
            save_card: false,
            description: order.description,
            metadata: { order_ref: order.order_ref, ...(order.metadata ?? {}) },
            reference: { transaction: order.order_ref, order: order.order_ref },
            receipt: { email: true, sms: false },
            customer: {
                first_name: order.user_name?.split(" ")[0] ?? "Customer",
                last_name: order.user_name?.split(" ").slice(1).join(" ") ?? "",
                email: order.user_email ?? undefined,
                phone: order.user_phone ? {
                    country_code: "+971",
                    number: order.user_phone.replace(/^\+971/, "").replace(/\D/g, ""),
                } : undefined,
            },
            merchant: { id: "" },
            source: { id: "src_all" },
            post: { url: `${this.appUrl}/api/webhooks/tap` },
            redirect: { url: `${this.appUrl}/dashboard/payment/success?order_ref=${order.order_ref}` },
        };
        const response = await fetch("https://api.tap.company/v2/charges", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.errors || data.http_code >= 400) {
            throw new common_1.BadRequestException(`Tap error: ${data.errors?.[0]?.description ?? JSON.stringify(data)}`);
        }
        const paymentUrl = data.transaction?.url ?? data.redirect?.url;
        if (!paymentUrl) {
            throw new common_1.BadRequestException("Tap did not return a payment URL.");
        }
        return {
            gateway: "tap",
            payment_url: paymentUrl,
            order_ref: data.id ?? order.order_ref,
            session_id: data.id,
        };
    }
    async generatePayPalLink(order) {
        const clientId = process.env.PAYPAL_CLIENT_ID ?? "";
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? "";
        const mode = process.env.PAYPAL_MODE ?? "sandbox";
        if (!clientId || !clientSecret) {
            throw new common_1.BadRequestException("PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in env.");
        }
        const baseUrl = mode === "live"
            ? "https://api-m.paypal.com"
            : "https://api-m.sandbox.paypal.com";
        const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
            throw new common_1.BadRequestException("Failed to authenticate with PayPal.");
        }
        const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
                "PayPal-Request-Id": order.order_ref,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                        reference_id: order.order_ref,
                        description: order.description,
                        amount: {
                            currency_code: order.currency ?? "USD",
                            value: order.amount.toFixed(2),
                        },
                    }],
                application_context: {
                    brand_name: "BizMate AI",
                    locale: "en-AE",
                    landing_page: "NO_PREFERENCE",
                    user_action: "PAY_NOW",
                    return_url: `${this.appUrl}/dashboard/payment/success?gateway=paypal&order_ref=${order.order_ref}`,
                    cancel_url: `${this.appUrl}/dashboard/payment/cancel?order_ref=${order.order_ref}`,
                },
            }),
        });
        const orderData = await orderRes.json();
        if (orderData.name === "INVALID_REQUEST" || !orderData.id) {
            throw new common_1.BadRequestException(`PayPal order creation failed: ${JSON.stringify(orderData)}`);
        }
        const approvalUrl = orderData.links?.find((l) => l.rel === "approve")?.href;
        if (!approvalUrl) {
            throw new common_1.BadRequestException("PayPal did not return an approval URL.");
        }
        return {
            gateway: "paypal",
            payment_url: approvalUrl,
            order_ref: orderData.id,
            session_id: orderData.id,
        };
    }
    async createPaymentLink(gateway, order, credentials) {
        switch (gateway.toLowerCase()) {
            case "stripe": return this.generateStripeLink(order);
            case "telr": return this.generateTelrLink(order);
            case "tap": return this.generateTapLink(order);
            case "paypal": return this.generatePayPalLink(order);
            default: throw new common_1.BadRequestException(`Unsupported gateway: ${gateway}`);
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=PaymentService.js.map