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
    async increment_usage_service(subscriptionId, usageKey, amount = 1, periodStart, periodEnd) {
        const now = new Date();
        const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
        const end = periodEnd ||
            new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
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
            return this.subscriptionUsageRepo.save(existing);
        }
        else {
            const usage = this.subscriptionUsageRepo.create({
                subscriptionId,
                usageKey,
                used: amount,
                periodStart: start,
                periodEnd: end,
                lastUsedAt: new Date(),
            });
            return this.subscriptionUsageRepo.save(usage);
        }
    }
    async get_subscription_usage_serice(subscriptionId, usageKey, periodStart, periodEnd) {
        const now = new Date();
        const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
        const end = periodEnd ||
            new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        return this.subscriptionUsageRepo.findOne({
            where: {
                subscriptionId,
                usageKey,
                periodStart: start,
                periodEnd: end,
            },
        });
    }
    async check_usage_limit_service(subscriptionId, usageKey) {
        const usage = await this.get_subscription_usage_serice(subscriptionId, usageKey);
        return { usage: usage?.used || 0 };
    }
    async reset_usage_service(subscriptionId, usageKey, periodStart, periodEnd) {
        const now = new Date();
        const start = periodStart || new Date(now.getFullYear(), now.getMonth(), 1);
        const end = periodEnd ||
            new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const query = this.subscriptionUsageRepo
            .createQueryBuilder()
            .update(subscription_usage_entity_1.SubscriptionUsage)
            .set({ used: 0 })
            .where("subscription_id = :subscriptionId", { subscriptionId })
            .andWhere("period_start = :start", { start })
            .andWhere("period_end = :end", { end });
        if (usageKey) {
            query.andWhere("usage_key = :usageKey", { usageKey });
        }
        await query.execute();
    }
    async all_usage_for_subscription_service(subscriptionId) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        return this.subscriptionUsageRepo.find({
            where: {
                subscriptionId,
                periodStart: start,
                periodEnd: end,
            },
        });
    }
    async enforce_limit_service(subscriptionId, usageKey, limit, amount = 1) {
        const usage = await this.get_subscription_usage_serice(subscriptionId, usageKey);
        const currentUsed = usage?.used || 0;
        if (currentUsed + amount > limit) {
            throw new common_1.BadRequestException(`Usage limit exceeded for ${usageKey}: ${currentUsed}/${limit}`);
        }
        await this.increment_usage_service(subscriptionId, usageKey, amount);
    }
};
exports.SubscriptionUsageService = SubscriptionUsageService;
exports.SubscriptionUsageService = SubscriptionUsageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_usage_entity_1.SubscriptionUsage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubscriptionUsageService);
//# sourceMappingURL=subscription_usage.service.js.map