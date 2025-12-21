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
exports.SubscriptionPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const subscription_payments_service_1 = require("./subscription_payments.service");
const subscription_payments_entity_1 = require("./subscription_payments.entity");
let SubscriptionPaymentsController = class SubscriptionPaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPayment(subscriptionId, amount, paymentMethod) {
        const payment = await this.paymentsService.createPayment(subscriptionId, amount, paymentMethod);
        return { success: true, payment };
    }
    async updatePaymentStatus(paymentId, status, transactionId, paidAt) {
        const payment = await this.paymentsService.updatePaymentStatus(paymentId, status, transactionId, paidAt);
        return { success: true, payment };
    }
    async getPaymentsBySubscription(subscriptionId) {
        const payments = await this.paymentsService.getPaymentsBySubscription(subscriptionId);
        return { success: true, payments };
    }
    async getAllPayments() {
        const payments = await this.paymentsService.getAllPayments();
        return { success: true, payments };
    }
};
exports.SubscriptionPaymentsController = SubscriptionPaymentsController;
__decorate([
    (0, common_1.Post)(":subscriptionId/create"),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __param(1, (0, common_1.Body)("amount")),
    __param(2, (0, common_1.Body)("paymentMethod")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)(":paymentId/status"),
    __param(0, (0, common_1.Param)("paymentId")),
    __param(1, (0, common_1.Body)("status")),
    __param(2, (0, common_1.Body)("transactionId")),
    __param(3, (0, common_1.Body)("paidAt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Date]),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Get)("subscription/:subscriptionId"),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "getPaymentsBySubscription", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "getAllPayments", null);
exports.SubscriptionPaymentsController = SubscriptionPaymentsController = __decorate([
    (0, common_1.Controller)("subscription-payments"),
    __metadata("design:paramtypes", [subscription_payments_service_1.SubscriptionPaymentsService])
], SubscriptionPaymentsController);
//# sourceMappingURL=subscription_payments.controller.js.map