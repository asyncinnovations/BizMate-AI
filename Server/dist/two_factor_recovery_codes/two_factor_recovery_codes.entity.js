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
exports.TwoFactorRecoveryCode = void 0;
const typeorm_1 = require("typeorm");
let TwoFactorRecoveryCode = class TwoFactorRecoveryCode {
    id;
    uuid;
    user_id;
    code;
    is_used;
    created_at;
};
exports.TwoFactorRecoveryCode = TwoFactorRecoveryCode;
__decorate([
    (0, typeorm_1.Column)({ generated: "increment", type: "integer" }),
    __metadata("design:type", Number)
], TwoFactorRecoveryCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], TwoFactorRecoveryCode.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], TwoFactorRecoveryCode.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], TwoFactorRecoveryCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], TwoFactorRecoveryCode.prototype, "is_used", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp with time zone",
        default: () => "NOW()",
    }),
    __metadata("design:type", Date)
], TwoFactorRecoveryCode.prototype, "created_at", void 0);
exports.TwoFactorRecoveryCode = TwoFactorRecoveryCode = __decorate([
    (0, typeorm_1.Entity)({ name: "two_factor_recovery_codes" })
], TwoFactorRecoveryCode);
//# sourceMappingURL=two_factor_recovery_codes.entity.js.map