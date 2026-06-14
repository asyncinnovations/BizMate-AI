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
exports.SubscriptionPlanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const subscription_plans_entity_1 = require("./subscription_plans.entity");
const user_entity_1 = require("../auth/user.entity");
const user_subscription_entity_1 = require("../user_subscription/user_subscription.entity");
const PaymentService_1 = require("../services/PaymentService");
const subscription_payments_service_1 = require("../subscription_payments/subscription_payments.service");
const subscription_payments_entity_1 = require("../subscription_payments/subscription_payments.entity");
let SubscriptionPlanService = class SubscriptionPlanService {
    planRepo;
    userSubscriptionRepo;
    userRepo;
    paymentService;
    paymentsService;
    constructor(planRepo, userSubscriptionRepo, userRepo, paymentService, paymentsService) {
        this.planRepo = planRepo;
        this.userSubscriptionRepo = userSubscriptionRepo;
        this.userRepo = userRepo;
        this.paymentService = paymentService;
        this.paymentsService = paymentsService;
    }
    async all_subscription_plan_service() {
        return this.planRepo.find({ where: { is_active: true } });
    }
    async create_subscription_plan_service(data) {
        const response = this.planRepo.create(data);
        return this.planRepo.save(response);
    }
    async create_checkout_session_service(data) {
        const user = await this.userRepo.findOne({ where: { uuid: data.userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const plan = await this.planRepo.findOne({
            where: { uuid: data.planId, is_active: true },
        });
        if (!plan)
            throw new common_1.NotFoundException("Plan not found or inactive");
        const price = Number(plan.price);
        if (price === 0 || data.gateway === "free") {
            const subscription = await this.activate_subscription(data.userId, data.planId);
            return {
                free: true,
                subscription_id: subscription.uuid,
                message: "Free plan activated successfully",
            };
        }
        if (data.action !== "subscribe") {
            const existing = await this.user_subscription_plan_service(data.userId);
            if (existing) {
                await this.userSubscriptionRepo.update({ uuid: existing.uuid }, { status: user_subscription_entity_1.SubscriptionStatus.CANCELLED });
            }
        }
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration_days);
        const subscription = this.userSubscriptionRepo.create({
            user_id: data.userId,
            plan_id: data.planId,
            start_date: startDate,
            end_date: endDate,
            status: user_subscription_entity_1.SubscriptionStatus.ACTIVE,
        });
        const savedSub = await this.userSubscriptionRepo.save(subscription);
        const orderRef = `BIZ-${Date.now()}-${data.userId.slice(0, 8).toUpperCase()}`;
        const methodMap = {
            stripe: subscription_payments_entity_1.PaymentMethod.STRIPE,
            telr: subscription_payments_entity_1.PaymentMethod.TELR,
            tap: subscription_payments_entity_1.PaymentMethod.TAP,
            paypal: subscription_payments_entity_1.PaymentMethod.PAYPAL,
            apple_pay: subscription_payments_entity_1.PaymentMethod.APPLE_PAY,
            google_pay: subscription_payments_entity_1.PaymentMethod.GOOGLE_PAY,
        };
        await this.paymentsService.createPaymentWithRef({
            userSubscriptionId: savedSub.uuid,
            amount: price,
            currency: data.currency ?? "AED",
            paymentMethod: methodMap[data.gateway] ?? subscription_payments_entity_1.PaymentMethod.CARD,
            gateway: data.gateway,
            orderRef,
        });
        const paymentLink = await this.paymentService.createPaymentLink(data.gateway, {
            amount: price,
            currency: data.currency ?? "AED",
            description: `BizMate AI ${plan.name} Plan`,
            order_ref: orderRef,
            user_email: user.email,
            user_name: user.full_name,
            metadata: {
                user_id: data.userId,
                plan_id: data.planId,
                subscription_id: savedSub.uuid,
            },
        });
        return {
            free: false,
            payment_url: paymentLink.payment_url,
            order_ref: orderRef,
            session_id: paymentLink.session_id,
            subscription_id: savedSub.uuid,
            gateway: data.gateway,
            amount: price,
            currency: data.currency ?? "AED",
        };
    }
    async activate_subscription(userId, planId) {
        const plan = await this.planRepo.findOne({ where: { uuid: planId } });
        if (!plan)
            throw new common_1.NotFoundException("Plan not found");
        const existing = await this.user_subscription_plan_service(userId);
        if (existing) {
            await this.userSubscriptionRepo.update({ uuid: existing.uuid }, { status: user_subscription_entity_1.SubscriptionStatus.CANCELLED });
        }
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration_days);
        const subscription = this.userSubscriptionRepo.create({
            user_id: userId,
            plan_id: planId,
            start_date: startDate,
            end_date: endDate,
            status: user_subscription_entity_1.SubscriptionStatus.ACTIVE,
        });
        return this.userSubscriptionRepo.save(subscription);
    }
    async subscribe_subscription_plan_service(userId, planId) {
        return this.activate_subscription(userId, planId);
    }
    async user_subscription_plan_service(userId) {
        return this.userSubscriptionRepo.findOne({
            where: { user_id: userId, status: user_subscription_entity_1.SubscriptionStatus.ACTIVE },
        });
    }
    async cancel_subscription_plan_service(userId) {
        const subscription = await this.user_subscription_plan_service(userId);
        if (!subscription)
            throw new common_1.NotFoundException("Active subscription not found");
        subscription.status = user_subscription_entity_1.SubscriptionStatus.CANCELLED;
        subscription.end_date = new Date();
        return this.userSubscriptionRepo.save(subscription);
    }
    async expire_subscription_plan_service() {
        await this.userSubscriptionRepo
            .createQueryBuilder()
            .update(user_subscription_entity_1.UserSubscription)
            .set({ status: user_subscription_entity_1.SubscriptionStatus.EXPIRED })
            .where("end_date < NOW() AND status = :active", { active: user_subscription_entity_1.SubscriptionStatus.ACTIVE })
            .execute();
    }
    async upgrade_subscription_plan_service(userId, newPlanId) {
        return this.activate_subscription(userId, newPlanId);
    }
    async downgrade_subscription_plan_service(userId, newPlanId) {
        return this.activate_subscription(userId, newPlanId);
    }
};
exports.SubscriptionPlanService = SubscriptionPlanService;
exports.SubscriptionPlanService = SubscriptionPlanService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(subscription_plans_entity_1.SubscriptionPlan)),
    __param(1, (0, typeorm_2.InjectRepository)(user_subscription_entity_1.UserSubscription)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.AuthUsers)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        PaymentService_1.PaymentService,
        subscription_payments_service_1.SubscriptionPaymentsService])
], SubscriptionPlanService);
//# sourceMappingURL=subscription_plans.service.js.map