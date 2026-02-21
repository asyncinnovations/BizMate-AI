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
exports.SubscriptionUsageController = void 0;
const common_1 = require("@nestjs/common");
const subscription_usage_service_1 = require("./subscription_usage.service");
let SubscriptionUsageController = class SubscriptionUsageController {
    usageService;
    constructor(usageService) {
        this.usageService = usageService;
    }
    async incrementUsage(body) {
        const { subscriptionId, usageKey, amount = 1 } = body;
        return this.usageService.increment_usage_service(subscriptionId, usageKey, amount);
    }
    async getUsage(subscriptionId, usageKey) {
        return this.usageService.get_subscription_usage_serice(subscriptionId, usageKey);
    }
    async checkLimit(subscriptionId, usageKey, limit) {
        const exceeded = await this.usageService.check_usage_limit_service(subscriptionId, usageKey, limit);
        return { exceeded };
    }
    async resetUsage(body) {
        const { subscriptionId, usageKey } = body;
        await this.usageService.reset_usage_service(subscriptionId, usageKey);
        return { success: true };
    }
    async getAllUsage(subscriptionId) {
        return this.usageService.all_usage_for_subscription_service(subscriptionId);
    }
    async enforceLimit(body) {
        const { subscriptionId, usageKey, limit, amount = 1 } = body;
        try {
            await this.usageService.enforce_limit_service(subscriptionId, usageKey, limit, amount);
            return { success: true };
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException) {
                throw err;
            }
            throw new common_1.BadRequestException(err.message);
        }
    }
};
exports.SubscriptionUsageController = SubscriptionUsageController;
__decorate([
    (0, common_1.Post)("increment"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionUsageController.prototype, "incrementUsage", null);
__decorate([
    (0, common_1.Get)("feature_usage/:subscriptionId/:usageKey"),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __param(1, (0, common_1.Param)("usageKey")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionUsageController.prototype, "getUsage", null);
__decorate([
    (0, common_1.Get)("check_usage_limit/:subscriptionId/:usageKey"),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __param(1, (0, common_1.Param)("usageKey")),
    __param(2, (0, common_1.Query)("limit", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], SubscriptionUsageController.prototype, "checkLimit", null);
__decorate([
    (0, common_1.Post)("reset_usage"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionUsageController.prototype, "resetUsage", null);
__decorate([
    (0, common_1.Get)("all_subscription/:subscriptionId"),
    __param(0, (0, common_1.Param)("subscriptionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionUsageController.prototype, "getAllUsage", null);
__decorate([
    (0, common_1.Post)("enforce_limit"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionUsageController.prototype, "enforceLimit", null);
exports.SubscriptionUsageController = SubscriptionUsageController = __decorate([
    (0, common_1.Controller)("subscription-usage"),
    __metadata("design:paramtypes", [subscription_usage_service_1.SubscriptionUsageService])
], SubscriptionUsageController);
//# sourceMappingURL=subscription_usage.controller.js.map