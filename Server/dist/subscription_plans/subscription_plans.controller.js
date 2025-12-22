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
exports.SubscriptionPlanController = void 0;
const common_1 = require("@nestjs/common");
const subscription_plans_service_1 = require("./subscription_plans.service");
let SubscriptionPlanController = class SubscriptionPlanController {
    subscriptionService;
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    async create_subscription_plan(body) {
        try {
            const response = await this.subscriptionService.create_subscription_plan_service(body);
            return { message: "subscription plan created", response };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async all_subscription_plan() {
        try {
            const plans = await this.subscriptionService.all_subscription_plan_service();
            return { success: true, plans };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async subscribe_subscription_plan(userId, planId) {
        try {
            const subscription = await this.subscriptionService.subscribe_subscription_plan_service(userId, planId);
            return { success: true, subscription };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async user_subscription_plan(userId) {
        try {
            const subscription = await this.subscriptionService.user_subscription_plan_service(userId);
            return { success: true, subscription };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async cancel_subscription_plan(userId) {
        try {
            const subscription = await this.subscriptionService.cancel_subscription_plan_service(userId);
            return { success: true, subscription };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async upgrade_subscription_plan(userId, newPlanId) {
        try {
            const subscription = await this.subscriptionService.upgrade_subscription_plan_service(userId, newPlanId);
            return { success: true, subscription };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async downgrade_subscription_plan(userId, newPlanId) {
        try {
            const subscription = await this.subscriptionService.downgrade_subscription_plan_service(userId, newPlanId);
            return { success: true, subscription };
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.SubscriptionPlanController = SubscriptionPlanController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "create_subscription_plan", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "all_subscription_plan", null);
__decorate([
    (0, common_1.Post)("subscribe/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "subscribe_subscription_plan", null);
__decorate([
    (0, common_1.Get)("user_current/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "user_subscription_plan", null);
__decorate([
    (0, common_1.Post)("cancel_user/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "cancel_subscription_plan", null);
__decorate([
    (0, common_1.Post)("upgrade/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "upgrade_subscription_plan", null);
__decorate([
    (0, common_1.Post)("downgrade/:userId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Body)("planId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SubscriptionPlanController.prototype, "downgrade_subscription_plan", null);
exports.SubscriptionPlanController = SubscriptionPlanController = __decorate([
    (0, common_1.Controller)("subscription_plan"),
    __metadata("design:paramtypes", [subscription_plans_service_1.SubscriptionPlanService])
], SubscriptionPlanController);
//# sourceMappingURL=subscription_plans.controller.js.map