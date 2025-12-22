"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const subscription_payments_service_1 = require("./subscription_payments.service");
const subscription_payments_controller_1 = require("./subscription_payments.controller");
const typeorm_1 = require("@nestjs/typeorm");
const subscription_payments_entity_1 = require("./subscription_payments.entity");
const user_subscription_entity_1 = require("../user_subscription/user_subscription.entity");
let SubscriptionPaymentsModule = class SubscriptionPaymentsModule {
};
exports.SubscriptionPaymentsModule = SubscriptionPaymentsModule;
exports.SubscriptionPaymentsModule = SubscriptionPaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([subscription_payments_entity_1.SubscriptionPayment, user_subscription_entity_1.UserSubscription])],
        providers: [subscription_payments_service_1.SubscriptionPaymentsService],
        controllers: [subscription_payments_controller_1.SubscriptionPaymentsController],
    })
], SubscriptionPaymentsModule);
//# sourceMappingURL=subscription_payments.module.js.map