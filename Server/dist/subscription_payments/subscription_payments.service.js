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
exports.SubscriptionPaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const subscription_payments_entity_1 = require("./subscription_payments.entity");
const user_subscription_entity_1 = require("../user_subscription/user_subscription.entity");
let SubscriptionPaymentsService = class SubscriptionPaymentsService {
    paymentRepo;
    subscriptionRepo;
    constructor(paymentRepo, subscriptionRepo) {
        this.paymentRepo = paymentRepo;
        this.subscriptionRepo = subscriptionRepo;
    }
    async createPayment(userSubscriptionId, amount, paymentMethod) {
        const subscription = await this.subscriptionRepo.findOne({
            where: { uuid: userSubscriptionId },
        });
        if (!subscription)
            throw new common_1.NotFoundException("User subscription not found");
        const payment = this.paymentRepo.create({
            user_subscription_id: subscription.uuid,
            amount,
            payment_method: paymentMethod,
            payment_status: subscription_payments_entity_1.PaymentStatus.PENDING,
        });
        return this.paymentRepo.save(payment);
    }
    async updatePaymentStatus(paymentId, status, transactionId, paidAt) {
        const payment = await this.paymentRepo.findOne({
            where: { id: paymentId },
        });
        if (!payment)
            throw new common_1.NotFoundException("Payment not found");
        payment.payment_status = status;
        if (transactionId)
            payment.transaction_id = transactionId;
        if (paidAt)
            payment.paid_at = paidAt;
        return this.paymentRepo.save(payment);
    }
    async getPaymentsBySubscription(userSubscriptionId) {
        return this.paymentRepo.find({
            where: { user_subscription_id: userSubscriptionId },
            relations: ["user_subscription"],
        });
    }
    async getAllPayments() {
        return this.paymentRepo.find({ relations: ["user_subscription"] });
    }
};
exports.SubscriptionPaymentsService = SubscriptionPaymentsService;
exports.SubscriptionPaymentsService = SubscriptionPaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(subscription_payments_entity_1.SubscriptionPayment)),
    __param(1, (0, typeorm_2.InjectRepository)(user_subscription_entity_1.UserSubscription)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], SubscriptionPaymentsService);
//# sourceMappingURL=subscription_payments.service.js.map