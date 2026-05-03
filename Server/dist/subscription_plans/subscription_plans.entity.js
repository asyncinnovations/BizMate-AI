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
exports.SubscriptionPlan = exports.PlanName = void 0;
const typeorm_1 = require("typeorm");
var PlanName;
(function (PlanName) {
    PlanName["STARTUP"] = "Startup";
    PlanName["STARTER"] = "Starter";
    PlanName["PRO"] = "Pro";
    PlanName["ENTERPRISE"] = "Enterprise";
})(PlanName || (exports.PlanName = PlanName = {}));
let SubscriptionPlan = class SubscriptionPlan {
    id;
    uuid;
    name;
    description;
    features;
    price;
    duration_days;
    is_active;
    created_at;
    updated_at;
};
exports.SubscriptionPlan = SubscriptionPlan;
__decorate([
    (0, typeorm_1.Column)({ generated: "increment", type: "integer" }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: PlanName }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], SubscriptionPlan.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], SubscriptionPlan.prototype, "duration_days", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], SubscriptionPlan.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp with time zone",
        default: () => "NOW()",
    }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: "timestamp with time zone",
        default: () => "NOW()",
    }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "updated_at", void 0);
exports.SubscriptionPlan = SubscriptionPlan = __decorate([
    (0, typeorm_1.Entity)({ name: "subscription_plans" })
], SubscriptionPlan);
//# sourceMappingURL=subscription_plans.entity.js.map