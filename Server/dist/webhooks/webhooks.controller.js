"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const subscription_payments_service_1 = require("../subscription_payments/subscription_payments.service");
const subscription_plans_service_1 = require("../subscription_plans/subscription_plans.service");
const db_1 = require("../config/db");
const ResendService_1 = require("../services/ResendService");
let WebhooksController = class WebhooksController {
    paymentsService;
    planService;
    resendService;
    constructor(paymentsService, planService, resendService) {
        this.paymentsService = paymentsService;
        this.planService = planService;
        this.resendService = resendService;
    }
    async stripeWebhook(req, res, sig) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY ?? "");
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
        }
        catch (err) {
            console.error("[Stripe Webhook] Signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        console.log(`[Stripe Webhook] Event: ${event.type}`);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const orderRef = session.metadata?.order_ref;
            if (orderRef) {
                try {
                    await this.confirmPaymentByOrderRef(orderRef, session.payment_intent ?? session.id, "stripe");
                    console.log(`[Stripe Webhook] ✓ Confirmed ${orderRef}`);
                }
                catch (err) {
                    console.error("[Stripe Webhook] Confirm error:", err.message);
                }
            }
        }
        if (event.type === "checkout.session.expired" ||
            event.type === "payment_intent.payment_failed") {
            const orderRef = event.data.object?.metadata?.order_ref;
            if (orderRef)
                await this.failPaymentByOrderRef(orderRef);
        }
        return res.json({ received: true });
    }
    async telrSuccess(orderRef, tranRef, res) {
        if (!orderRef) {
            return res.redirect(`${process.env.APP_URL}/dashboard/payment/cancel`);
        }
        try {
            const verified = await this.verifyTelrPayment(orderRef);
            if (verified) {
                await this.confirmPaymentByOrderRef(orderRef, tranRef ?? orderRef, "telr");
                console.log(`[Telr Webhook] ✓ Confirmed ${orderRef}`);
            }
        }
        catch (err) {
            console.error("[Telr Webhook] Error:", err.message);
        }
        return res.redirect(`${process.env.APP_URL}/dashboard/payment/success?order_ref=${orderRef}&gateway=telr`);
    }
    async telrDecline(orderRef, res) {
        if (orderRef)
            await this.failPaymentByOrderRef(orderRef);
        return res.redirect(`${process.env.APP_URL}/dashboard/payment/cancel?order_ref=${orderRef}`);
    }
    async tapWebhook(body) {
        console.log("[Tap Webhook] Event:", body?.status, body?.id);
        if (body?.status === "CAPTURED" || body?.status === "AUTHORIZED") {
            const orderRef = body?.reference?.order ?? body?.metadata?.order_ref;
            if (orderRef) {
                await this.confirmPaymentByOrderRef(orderRef, body.id, "tap");
                console.log(`[Tap Webhook] ✓ Confirmed ${orderRef}`);
            }
        }
        if (body?.status === "FAILED" || body?.status === "DECLINED") {
            const orderRef = body?.reference?.order ?? body?.metadata?.order_ref;
            if (orderRef)
                await this.failPaymentByOrderRef(orderRef);
        }
        return { received: true };
    }
    async paypalCapture(token, payerId, orderRef, res) {
        if (!token) {
            return res.redirect(`${process.env.APP_URL}/dashboard/payment/cancel`);
        }
        try {
            const mode = process.env.PAYPAL_MODE ?? "sandbox";
            const baseUrl = mode === "live"
                ? "https://api-m.paypal.com"
                : "https://api-m.sandbox.paypal.com";
            const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "grant_type=client_credentials",
            });
            const { access_token } = await tokenRes.json();
            const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${token}/capture`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            });
            const captureData = await captureRes.json();
            if (captureData.status === "COMPLETED") {
                const ref = orderRef ?? captureData.id;
                await this.confirmPaymentByOrderRef(ref, captureData.id, "paypal");
                console.log(`[PayPal] ✓ Captured ${ref}`);
            }
        }
        catch (err) {
            console.error("[PayPal Capture] Error:", err.message);
        }
        return res.redirect(`${process.env.APP_URL}/dashboard/payment/success?gateway=paypal&order_ref=${orderRef ?? token}`);
    }
    async confirmPaymentByOrderRef(orderRef, txnId, gateway) {
        const { rows } = await db_1.pool.query(`SELECT sp.id, sp.user_subscription_id, sp.amount,
              us.user_id
       FROM subscription_payments sp
       JOIN user_subscriptions us ON us.uuid = sp.user_subscription_id
       WHERE sp.order_ref = $1
       LIMIT 1`, [orderRef]);
        if (!rows.length) {
            console.warn(`[Webhook] No payment found for order_ref: ${orderRef}`);
            return;
        }
        const payment = rows[0];
        await db_1.pool.query(`UPDATE subscription_payments
       SET payment_status = 'completed', transaction_id = $1,
           paid_at = NOW(), gateway = $2, updated_at = NOW()
       WHERE id = $3`, [txnId, gateway, payment.id]);
        await db_1.pool.query(`UPDATE user_subscriptions
       SET status = 'active', updated_at = NOW()
       WHERE uuid = $1`, [payment.user_subscription_id]);
        if (payment.user_id) {
            try {
                const { rows: userRows } = await db_1.pool.query(`SELECT email, full_name FROM users WHERE uuid = $1`, [payment.user_id]);
                const u = userRows[0];
                if (u?.email) {
                    await this.resendService.send({
                        to: u.email,
                        subject: "✅ BizMate AI — Payment Confirmed",
                        html: ResendService_1.EmailTemplates.invoicePaid({
                            invoice_number: orderRef,
                            customer_name: "BizMate AI",
                            total: payment.amount,
                            full_name: u.full_name,
                        }),
                    });
                    await db_1.pool.query(`INSERT INTO notifications
               (uuid, user_id, event_type, notification_type, title, message,
                status, is_read, created_at, updated_at)
             VALUES
               (gen_random_uuid(), $1, 'invoice_paid', 'dashboard', $2, $3,
                'sent', false, NOW(), NOW())`, [
                        payment.user_id,
                        "Payment confirmed",
                        `Payment of AED ${payment.amount} confirmed via ${gateway}. Your plan is now active.`,
                    ]);
                }
            }
            catch (e) {
                console.error("[Webhook] Email/notification error:", e.message);
            }
        }
    }
    async failPaymentByOrderRef(orderRef) {
        await db_1.pool.query(`UPDATE subscription_payments
       SET payment_status = 'failed', updated_at = NOW()
       WHERE order_ref = $1`, [orderRef]);
    }
    async verifyTelrPayment(orderRef) {
        try {
            const params = new URLSearchParams({
                method: "check",
                store: process.env.TELR_STORE_ID ?? "",
                authkey: process.env.TELR_AUTH_KEY ?? "",
                order: orderRef,
            });
            const res = await fetch("https://secure.telr.com/gateway/order.json", {
                method: "POST", body: params,
            });
            const data = await res.json();
            return data?.order?.status?.code === "A";
        }
        catch {
            return false;
        }
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)("stripe"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)("stripe-signature")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "stripeWebhook", null);
__decorate([
    (0, common_1.Get)("telr/success"),
    __param(0, (0, common_1.Query)("order_ref")),
    __param(1, (0, common_1.Query)("tran_ref")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "telrSuccess", null);
__decorate([
    (0, common_1.Get)("telr/decline"),
    __param(0, (0, common_1.Query)("order_ref")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "telrDecline", null);
__decorate([
    (0, common_1.Post)("tap"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "tapWebhook", null);
__decorate([
    (0, common_1.Get)("paypal/capture"),
    __param(0, (0, common_1.Query)("token")),
    __param(1, (0, common_1.Query)("PayerID")),
    __param(2, (0, common_1.Query)("order_ref")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "paypalCapture", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, common_1.Controller)("webhooks"),
    __metadata("design:paramtypes", [subscription_payments_service_1.SubscriptionPaymentsService,
        subscription_plans_service_1.SubscriptionPlanService,
        ResendService_1.ResendService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map