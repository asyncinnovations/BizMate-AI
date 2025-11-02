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
exports.UserPaymentGatewayEntity = void 0;
const typeorm_1 = require("typeorm");
let UserPaymentGatewayEntity = class UserPaymentGatewayEntity {
    id;
    uuid;
    user_id;
    gateway_name;
    credentials;
    is_active;
    created_at;
    updated_at;
};
exports.UserPaymentGatewayEntity = UserPaymentGatewayEntity;
__decorate([
    (0, typeorm_1.Column)({ generated: "increment", type: "integer" }),
    __metadata("design:type", Number)
], UserPaymentGatewayEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], UserPaymentGatewayEntity.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: "uuid" }),
    __metadata("design:type", String)
], UserPaymentGatewayEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], UserPaymentGatewayEntity.prototype, "gateway_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: false }),
    __metadata("design:type", Object)
], UserPaymentGatewayEntity.prototype, "credentials", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserPaymentGatewayEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserPaymentGatewayEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserPaymentGatewayEntity.prototype, "updated_at", void 0);
exports.UserPaymentGatewayEntity = UserPaymentGatewayEntity = __decorate([
    (0, typeorm_1.Entity)("user_payment_gateways"),
    (0, typeorm_1.Unique)(["user_id", "gateway_name"])
], UserPaymentGatewayEntity);
//# sourceMappingURL=user_payment_gateway.entity.js.map