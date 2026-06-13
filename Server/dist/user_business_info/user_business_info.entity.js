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
exports.UserBusinessInfo = void 0;
const typeorm_1 = require("typeorm");
let UserBusinessInfo = class UserBusinessInfo {
    uuid;
    id;
    user_id;
    business_name;
    owner_name;
    industry;
    business_type;
    services_offered;
    communication_channels;
    availability;
    faq;
    tone_examples;
    snapshot;
    is_active;
    business_location;
    compliance_framework;
    business_region;
    trade_license_number;
    trn;
    address;
    currency;
    created_at;
    updated_at;
};
exports.UserBusinessInfo = UserBusinessInfo;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], UserBusinessInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150 }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 150, nullable: true }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "owner_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "business_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "services_offered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        default: () => `'["Email","WhatsApp","Instagram"]'`,
    }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "communication_channels", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], UserBusinessInfo.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "faq", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "tone_examples", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "snapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], UserBusinessInfo.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        nullable: true,
        default: null,
        comment: "free_zone | mainland | offshore — collected at signup",
    }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "business_location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        nullable: true,
        default: null,
        comment: "mainland | free_zone | offshore — set in Compliance tab",
    }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "compliance_framework", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        nullable: true,
        default: "uae",
        comment: "GCC country: uae | saudi | qatar | kuwait | bahrain | oman",
    }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "business_region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true, default: null }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "trade_license_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true, default: null }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "trn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, nullable: true, default: "AED" }),
    __metadata("design:type", Object)
], UserBusinessInfo.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", Date)
], UserBusinessInfo.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "NOW()" }),
    __metadata("design:type", Date)
], UserBusinessInfo.prototype, "updated_at", void 0);
exports.UserBusinessInfo = UserBusinessInfo = __decorate([
    (0, typeorm_1.Entity)("user_business_info")
], UserBusinessInfo);
//# sourceMappingURL=user_business_info.entity.js.map