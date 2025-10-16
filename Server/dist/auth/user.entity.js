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
exports.AuthUsers = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["BUSINESS_OWNER"] = "business_owner";
    UserRole["TEAM_MEMBER"] = "team_member";
})(UserRole || (exports.UserRole = UserRole = {}));
let AuthUsers = class AuthUsers {
    id;
    uuid;
    full_name;
    email;
    phone;
    password_hash;
    company_name;
    license_number;
    vat_id;
    idustry;
    role;
    language_preference;
    created_at;
    updated_at;
};
exports.AuthUsers = AuthUsers;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AuthUsers.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", default: () => "gen_random_uuid()", unique: true }),
    __metadata("design:type", String)
], AuthUsers.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], AuthUsers.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, unique: true, nullable: false }),
    __metadata("design:type", String)
], AuthUsers.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, unique: true, nullable: true }),
    __metadata("design:type", String)
], AuthUsers.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], AuthUsers.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], AuthUsers.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], AuthUsers.prototype, "license_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], AuthUsers.prototype, "vat_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], AuthUsers.prototype, "idustry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: UserRole,
        default: UserRole.TEAM_MEMBER,
    }),
    __metadata("design:type", String)
], AuthUsers.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["en", "ar", "hi"],
        default: "en",
    }),
    __metadata("design:type", String)
], AuthUsers.prototype, "language_preference", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], AuthUsers.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], AuthUsers.prototype, "updated_at", void 0);
exports.AuthUsers = AuthUsers = __decorate([
    (0, typeorm_1.Entity)("users")
], AuthUsers);
//# sourceMappingURL=user.entity.js.map