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
let SubscriptionPlanService = class SubscriptionPlanService {
    planRepo;
    userSubscriptionRepo;
    userRepo;
    constructor(planRepo, userSubscriptionRepo, userRepo) {
        this.planRepo = planRepo;
        this.userSubscriptionRepo = userSubscriptionRepo;
        this.userRepo = userRepo;
    }
    async all_subscription_plan_service() {
        return this.planRepo.find({ where: { is_active: true } });
    }
    async create_subscription_plan_service(data) {
        const response = this.planRepo.create(data);
        const result = await this.planRepo.save(response);
        return result;
    }
    async subscribe_subscription_plan_service(userId, planId) {
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
        const subscription = this.userSubscriptionRepo.create({
            user_id: userId,
            plan_id: planId,
            end_date: endDate,
            start_date: startDate,
        });
        return this.userSubscriptionRepo.save(subscription);
    }
    async user_subscription_plan_service(userId) {
        return this.userSubscriptionRepo.findOne({
            where: {
                user_id: userId,
                status: user_subscription_entity_1.SubscriptionStatus.ACTIVE,
            },
        });
    }
    async cancel_subscription_plan_service(userId) {
        const subscription = await this.user_subscription_plan_service(userId);
        if (!subscription)
            throw new common_1.NotFoundException("Active subscription not found");
        subscription.status = "cancelled";
        subscription.end_date = new Date();
        return this.userSubscriptionRepo.save(subscription);
    }
    async expire_subscription_plan_service() {
        const now = new Date();
        const subscriptions = await this.userSubscriptionRepo.find({
            where: {},
        });
        for (const sub of subscriptions) {
            if (sub.end_date < now) {
                sub.status = "expired";
                await this.userSubscriptionRepo.save(sub);
            }
        }
    }
    async upgrade_subscription_plan_service(userId, newPlanId) {
        const currentSub = await this.user_subscription_plan_service(userId);
        if (!currentSub)
            throw new common_1.NotFoundException("Active subscription not found");
        const newPlan = await this.planRepo.findOne({
            where: { uuid: newPlanId, is_active: true },
        });
        if (!newPlan)
            throw new common_1.NotFoundException("Plan not found or inactive");
        if (newPlan.price <= currentSub.plan.price) {
            throw new common_1.BadRequestException("New plan must be higher than current plan for upgrade");
        }
        currentSub.plan = newPlan;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + newPlan.duration_days);
        currentSub.start_date = startDate;
        currentSub.end_date = endDate;
        return this.userSubscriptionRepo.save(currentSub);
    }
    async downgrade_subscription_plan_service(userId, newPlanId) {
        const currentSub = await this.user_subscription_plan_service(userId);
        if (!currentSub)
            throw new common_1.NotFoundException("Active subscription not found");
        const newPlan = await this.planRepo.findOne({
            where: { uuid: newPlanId, is_active: true },
        });
        if (!newPlan)
            throw new common_1.NotFoundException("Plan not found or inactive");
        if (newPlan.price >= currentSub.plan.price) {
            throw new common_1.BadRequestException("New plan must be lower than current plan for downgrade");
        }
        currentSub.plan = newPlan;
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + newPlan.duration_days);
        currentSub.start_date = startDate;
        currentSub.end_date = endDate;
        return this.userSubscriptionRepo.save(currentSub);
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
        typeorm_1.Repository])
], SubscriptionPlanService);
//# sourceMappingURL=subscription_plans.service.js.map