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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../auth/user.entity");
const user_subscription_entity_1 = require("./user_subscription.entity");
const subscription_plans_entity_1 = require("../subscription_plans/subscription_plans.entity");
let UserSubscriptionService = class UserSubscriptionService {
    subscriptionRepo;
    userRepo;
    planRepo;
    constructor(subscriptionRepo, userRepo, planRepo) {
        this.subscriptionRepo = subscriptionRepo;
        this.userRepo = userRepo;
        this.planRepo = planRepo;
    }
    async createSubscription(userId, planId) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const plan = await this.planRepo.findOne({
            where: { uuid: planId, is_active: true },
        });
        if (!plan)
            throw new common_1.NotFoundException("Plan not found or inactive");
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration_days);
        const subscription = this.subscriptionRepo.create({
            user_id: userId,
            plan_id: planId,
            start_date: startDate,
            end_date: endDate,
            status: user_subscription_entity_1.SubscriptionStatus.ACTIVE,
        });
        return this.subscriptionRepo.save(subscription);
    }
    async getUserSubscription(userId) {
        return this.subscriptionRepo.findOne({
            where: { user_id: userId, status: user_subscription_entity_1.SubscriptionStatus.ACTIVE },
            relations: ["plan"],
        });
    }
    async cancelSubscription(userId) {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription)
            throw new common_1.NotFoundException("Active subscription not found");
        subscription.status = user_subscription_entity_1.SubscriptionStatus.CANCELLED;
        subscription.end_date = new Date();
        return this.subscriptionRepo.save(subscription);
    }
    async upgradeSubscription(userId, newPlanId) {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription)
            throw new common_1.NotFoundException("Active subscription not found");
        const newPlan = await this.planRepo.findOne({
            where: { uuid: newPlanId, is_active: true },
        });
        if (!newPlan)
            throw new common_1.NotFoundException("Plan not found or inactive");
        if (newPlan.price <= subscription.plan.price) {
            throw new common_1.BadRequestException("New plan must be higher than current for upgrade");
        }
        subscription.plan = newPlan;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + newPlan.duration_days);
        subscription.start_date = startDate;
        subscription.end_date = endDate;
        return this.subscriptionRepo.save(subscription);
    }
    async downgradeSubscription(userId, newPlanId) {
        const subscription = await this.getUserSubscription(userId);
        if (!subscription)
            throw new common_1.NotFoundException("Active subscription not found");
        const newPlan = await this.planRepo.findOne({
            where: { uuid: newPlanId, is_active: true },
        });
        if (!newPlan)
            throw new common_1.NotFoundException("Plan not found or inactive");
        if (newPlan.price >= subscription.plan.price) {
            throw new common_1.BadRequestException("New plan must be lower than current for downgrade");
        }
        subscription.plan = newPlan;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + newPlan.duration_days);
        subscription.start_date = startDate;
        subscription.end_date = endDate;
        return this.subscriptionRepo.save(subscription);
    }
    async expireSubscriptions() {
        const now = new Date();
        const subscriptions = await this.subscriptionRepo.find({
            where: { status: user_subscription_entity_1.SubscriptionStatus.ACTIVE },
        });
        for (const sub of subscriptions) {
            if (sub.end_date < now) {
                sub.status = user_subscription_entity_1.SubscriptionStatus.EXPIRED;
                await this.subscriptionRepo.save(sub);
            }
        }
    }
};
exports.UserSubscriptionService = UserSubscriptionService;
exports.UserSubscriptionService = UserSubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_subscription_entity_1.UserSubscription)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.AuthUsers)),
    __param(2, (0, typeorm_2.InjectRepository)(subscription_plans_entity_1.SubscriptionPlan)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _c : Object])
], UserSubscriptionService);
//# sourceMappingURL=user_subscription.service.js.map