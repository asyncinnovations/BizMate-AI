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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPayment = exports.PaymentStatus = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["STRIPE"] = "stripe";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["TELR"] = "telr";
    PaymentMethod["TAP"] = "tap";
    PaymentMethod["APPLE_PAY"] = "apple_pay";
    PaymentMethod["GOOGLE_PAY"] = "google_pay";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["FREE"] = "free";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let SubscriptionPayment = class SubscriptionPayment {
    id;
    user_subscription_id;
    payment_method;
    gateway;
    amount;
    currency;
    payment_status;
    transaction_id;
    order_ref;
    paid_at;
    created_at;
    updated_at;
};
exports.SubscriptionPayment = SubscriptionPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "user_subscription_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: PaymentMethod }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "gateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubscriptionPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, nullable: true, default: "AED" }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "payment_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 200, nullable: true }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true, unique: true }),
    __metadata("design:type", String)
], SubscriptionPayment.prototype, "order_ref", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], SubscriptionPayment.prototype, "paid_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp with time zone", default: () => "NOW()" }),
    __metadata("design:type", Date)
], SubscriptionPayment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp with time zone", default: () => "NOW()" }),
    __metadata("design:type", Date)
], SubscriptionPayment.prototype, "updated_at", void 0);
exports.SubscriptionPayment = SubscriptionPayment = __decorate([
    (0, typeorm_1.Entity)({ name: "subscription_payments" })
], SubscriptionPayment);
//# sourceMappingURL=subscription_payments.entity.js.map