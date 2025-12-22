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
exports.UserTwoFactorSettings = void 0;
const typeorm_1 = require("typeorm");
let UserTwoFactorSettings = class UserTwoFactorSettings {
    id;
    uuid;
    user_id;
    is_enabled;
    method;
    secret;
    phone;
    email;
    created_at;
    updated_at;
};
exports.UserTwoFactorSettings = UserTwoFactorSettings;
__decorate([
    (0, typeorm_1.Column)({ generated: "increment", type: "integer" }),
    __metadata("design:type", Number)
], UserTwoFactorSettings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], UserTwoFactorSettings.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], UserTwoFactorSettings.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], UserTwoFactorSettings.prototype, "is_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 30 }),
    __metadata("design:type", String)
], UserTwoFactorSettings.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], UserTwoFactorSettings.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, nullable: true }),
    __metadata("design:type", Object)
], UserTwoFactorSettings.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], UserTwoFactorSettings.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: "timestamp with time zone",
        default: () => "NOW()",
    }),
    __metadata("design:type", Date)
], UserTwoFactorSettings.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        type: "timestamp with time zone",
        default: () => "NOW()",
        onUpdate: "NOW()",
    }),
    __metadata("design:type", Date)
], UserTwoFactorSettings.prototype, "updated_at", void 0);
exports.UserTwoFactorSettings = UserTwoFactorSettings = __decorate([
    (0, typeorm_1.Entity)({ name: "user_two_factor_settings" })
], UserTwoFactorSettings);
//# sourceMappingURL=user_two_factor_settings.entity.js.map