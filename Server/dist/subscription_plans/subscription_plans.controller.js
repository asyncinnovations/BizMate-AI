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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const subscription_plans_service_1 = require("./subscription_plans.service");
let SubscriptionController = class SubscriptionController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async getAllPlans() {
        const plans = await this.subscriptionService.getAllPlans();
        return { success: true, plans };
    }
    async subscribeUser(userId, planId) {
        const subscription = await this.subscriptionService.subscribeUser(userId, planId);
        return { success: true, subscription };
    }
    async getUserSubscription(userId) {
        const subscription = await this.subscriptionService.getUserSubscription(userId);
        return { success: true, subscription };
    }
    async cancelSubscription(userId) {
        const subscription = await this.subscriptionService.cancelSubscription(userId);
        return { success: true, subscription };
    }
    async upgradeSubscription(userId, newPlanId) {
        const subscription = await this.subscriptionService.upgradeSubscription(userId, newPlanId);
        return { success: true, subscription };
    }
    async downgradeSubscription(userId, newPlanId) {
        const subscription = await this.subscriptionService.downgradeSubscription(userId, newPlanId);
        return { success: true, subscription };
    }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)("plans"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getAllPlans", null);
__decorate([
    (0, common_1.Post)(":userId/subscribe"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "subscribeUser", null);
__decorate([
    (0, common_1.Get)(":userId/current"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "getUserSubscription", null);
__decorate([
    (0, common_1.Post)(":userId/cancel"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)(":userId/upgrade"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "upgradeSubscription", null);
__decorate([
    (0, common_1.Post)(":userId/downgrade"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionController.prototype, "downgradeSubscription", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, common_1.Controller)("subscription"),
    __metadata("design:paramtypes", [subscription_plans_service_1.SubscriptionPlanService])
], SubscriptionController);
//# sourceMappingURL=subscription_plans.controller.js.map