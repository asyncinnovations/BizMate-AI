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
    async create_wallet_transaction(subscriptionId, amount, paymentMethod) {
        try {
            const payment = await this.paymentsService.createPayment(subscriptionId, amount, paymentMethod);
            return { success: true, payment };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_transaction_status(paymentId, status, transactionId, paidAt) {
        try {
            const payment = await this.paymentsService.updatePaymentStatus(paymentId, status, transactionId, paidAt);
            return { success: true, payment };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async subscription_transaction(subscriptionId) {
        try {
            const payments = await this.paymentsService.getPaymentsBySubscription(subscriptionId);
            return { success: true, payments };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async all_wallet_transaction() {
        try {
            const payments = await this.paymentsService.getAllPayments();
            return { success: true, payments };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.SubscriptionPaymentsController = SubscriptionPaymentsController;
__decorate([
    (0, common_1.Post)("create/:plan_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)("plan_id")),
    __param(1, (0, common_1.Body)("amount")),
    __param(2, (0, common_1.Body)("paymentMethod")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "create_wallet_transaction", null);
__decorate([
    (0, common_1.Post)("status/:paymentId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("paymentId")),
    __param(1, (0, common_1.Body)("status")),
    __param(2, (0, common_1.Body)("transactionId")),
    __param(3, (0, common_1.Body)("paidAt")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Date]),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "update_transaction_status", null);
__decorate([
    (0, common_1.Get)("subscription/:subscriptionId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "subscription_transaction", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionPaymentsController.prototype, "all_wallet_transaction", null);
exports.SubscriptionPaymentsController = SubscriptionPaymentsController = __decorate([
    (0, common_1.Controller)("subscription-payments"),
    __metadata("design:paramtypes", [subscription_payments_service_1.SubscriptionPaymentsService])
], SubscriptionPaymentsController);
//# sourceMappingURL=subscription_payments.controller.js.map