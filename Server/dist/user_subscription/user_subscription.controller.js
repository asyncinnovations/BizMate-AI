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
exports.UserSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const user_subscription_service_1 = require("./user_subscription.service");
let UserSubscriptionController = class UserSubscriptionController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async createSubscription(userId, planId) {
        const subscription = await this.subscriptionService.createSubscription(userId, planId);
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
exports.UserSubscriptionController = UserSubscriptionController;
__decorate([
    (0, common_1.Post)(":userId/create"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "createSubscription", null);
__decorate([
    (0, common_1.Get)(":userId/current"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "getUserSubscription", null);
__decorate([
    (0, common_1.Post)(":userId/cancel"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "cancelSubscription", null);
__decorate([
    (0, common_1.Post)(":userId/upgrade"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "upgradeSubscription", null);
__decorate([
    (0, common_1.Post)(":userId/downgrade"),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserSubscriptionController.prototype, "downgradeSubscription", null);
exports.UserSubscriptionController = UserSubscriptionController = __decorate([
    (0, common_1.Controller)("user-subscription"),
    __metadata("design:paramtypes", [user_subscription_service_1.UserSubscriptionService])
], UserSubscriptionController);
//# sourceMappingURL=user_subscription.controller.js.map