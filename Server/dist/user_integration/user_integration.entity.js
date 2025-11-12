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
exports.UserIntegration = void 0;
const typeorm_1 = require("typeorm");
let UserIntegration = class UserIntegration {
    uuid;
    id;
    user_id;
    platform;
    access_token;
    refresh_token;
    expires_at;
    last_sync_at;
    status;
    metadata;
    created_at;
    updated_at;
};
exports.UserIntegration = UserIntegration;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], UserIntegration.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], UserIntegration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UserIntegration.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        nullable: false,
    }),
    __metadata("design:type", String)
], UserIntegration.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], UserIntegration.prototype, "access_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], UserIntegration.prototype, "refresh_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserIntegration.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserIntegration.prototype, "last_sync_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        nullable: false,
        default: "disconnected",
    }),
    __metadata("design:type", String)
], UserIntegration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], UserIntegration.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", Date)
], UserIntegration.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", Date)
], UserIntegration.prototype, "updated_at", void 0);
exports.UserIntegration = UserIntegration = __decorate([
    (0, typeorm_1.Entity)("user_integrations")
], UserIntegration);
//# sourceMappingURL=user_integration.entity.js.map