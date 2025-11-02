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
    async generateTelrLink(credentials, amount) {
        const params = new URLSearchParams({
            method: "create",
            store: credentials.store_id,
            authkey: credentials.auth_key,
            test: "1",
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
        if (data.error)
            throw new Error(data.error.message);
        return {
            gateway: "telr",
            payment_url: data.order.url,
            order_ref: data.order.ref,
        };
    }
    async generatePayPalLink(credentials, amount) {
        const paypal = require("@paypal/checkout-server-sdk");
        const env = new paypal.core.SandboxEnvironment(credentials.client_id, credentials.client_secret);
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
        const approvalUrl = order.result.links.find((link) => link.rel === "approve").href;
        return { gateway: "paypal", payment_url: approvalUrl };
    }
    async generateStripeLink(credentials, amount) {
        const stripe = require("stripe")(credentials.secret_key);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "aed",
                        product_data: { name: "Payment for Order" },
                        unit_amount: amount * 100,
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
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=PaymentService.js.map