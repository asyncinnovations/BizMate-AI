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
exports.SubscriptionUsageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_usage_entity_1 = require("./subscription_usage.entity");
let SubscriptionUsageService = class SubscriptionUsageService {
    subscriptionUsageRepo;
    constructor(subscriptionUsageRepo) {
        this.subscriptionUsageRepo = subscriptionUsageRepo;
    }
    getPeriodDates(type) {
        const now = new Date();
        if (type === "daily") {
            const start = new Date(now.setHours(0, 0, 0, 0));
            const end = new Date(now.setHours(23, 59, 59, 999));
            return { start, end };
        }
        if (type === "monthly") {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            return { start, end };
        }
        return { start: new Date(0), end: new Date(2099, 11, 31) };
    }
    async increment_usage_service(subscriptionId, usageKey, amount = 1, options) {
        const pType = options?.periodType || "monthly";
        const { start, end } = this.getPeriodDates(pType);
        const existing = await this.subscriptionUsageRepo.findOne({
            where: {
                subscriptionId,
                usageKey,
                periodStart: start,
            },
        });
        if (existing) {
            existing.used += amount;
            existing.lastUsedAt = new Date();
            if (options?.limitSnapshot)
                existing.limitSnapshot = options.limitSnapshot;
            return this.subscriptionUsageRepo.save(existing);
        }
        else {
            const usage = this.subscriptionUsageRepo.create({
                subscriptionId,
                usageKey,
                used: amount,
                periodType: pType,
                periodStart: start,
                periodEnd: end,
                limitSnapshot: options?.limitSnapshot,
                policyType: options?.policyType || "strict",
                lastUsedAt: new Date(),
            });
            return this.subscriptionUsageRepo.save(usage);
        }
    }
    async get_subscription_usage_service(subscriptionId, usageKey, periodType = "monthly") {
        const { start } = this.getPeriodDates(periodType);
        return this.subscriptionUsageRepo.findOne({
            where: {
                subscriptionId,
                usageKey,
                periodStart: start,
            },
        });
    }
    async check_usage_limit_service(subscriptionId, usageKey, periodType = "monthly") {
        const usage = await this.get_subscription_usage_service(subscriptionId, usageKey, periodType);
        return {
            used: usage?.used || 0,
            policy: usage?.policyType || "strict",
        };
    }
    async enforce_limit_service(subscriptionId, usageKey, limit, amount = 1, options) {
        const pType = options?.periodType || "monthly";
        const policy = options?.policyType || "strict";
        const usage = await this.get_subscription_usage_service(subscriptionId, usageKey, pType);
        const currentUsed = usage?.used || 0;
        if (limit === -1 || policy === "unlimited") {
            await this.increment_usage_service(subscriptionId, usageKey, amount, {
                ...options,
                limitSnapshot: limit,
            });
            return;
        }
        if (policy === "strict" && currentUsed + amount > limit) {
            throw new common_1.BadRequestException(`Usage limit exceeded for ${usageKey}: ${currentUsed}/${limit}. Please upgrade your plan.`);
        }
        await this.increment_usage_service(subscriptionId, usageKey, amount, {
            ...options,
            limitSnapshot: limit,
        });
    }
    async reset_usage_service(subscriptionId, usageKey, periodType = "monthly") {
        const { start, end } = this.getPeriodDates(periodType);
        const query = this.subscriptionUsageRepo
            .createQueryBuilder()
            .update(subscription_usage_entity_1.SubscriptionUsage)
            .set({ used: 0, resetKey: `reset_${new Date().getTime()}` })
            .where("subscriptionId = :subscriptionId", { subscriptionId })
            .andWhere("periodStart = :start", { start })
            .andWhere("periodEnd = :end", { end });
        if (usageKey) {
            query.andWhere("usageKey = :usageKey", { usageKey });
        }
        await query.execute();
    }
    async all_usage_for_subscription_service(subscriptionId, periodType = "monthly") {
        const { start } = this.getPeriodDates(periodType);
        return this.subscriptionUsageRepo.find({
            where: {
                subscriptionId,
                periodStart: start,
            },
        });
    }
};
exports.SubscriptionUsageService = SubscriptionUsageService;
exports.SubscriptionUsageService = SubscriptionUsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_usage_entity_1.SubscriptionUsage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriptionUsageService);
//# sourceMappingURL=subscription_usage.service.js.map