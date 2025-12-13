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
exports.ComplianceLicense = exports.LicenseStatus = void 0;
const typeorm_1 = require("typeorm");
var LicenseStatus;
(function (LicenseStatus) {
    LicenseStatus["ACTIVE"] = "active";
    LicenseStatus["EXPIRED"] = "expired";
    LicenseStatus["SUSPENDED"] = "suspended";
})(LicenseStatus || (exports.LicenseStatus = LicenseStatus = {}));
let ComplianceLicense = class ComplianceLicense {
    id;
    uuid;
    user_id;
    company_id;
    license_type;
    license_number;
    issue_date;
    expiry_date;
    status;
    document_id;
    created_at;
    updated_at;
};
exports.ComplianceLicense = ComplianceLicense;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], ComplianceLicense.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "company_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "license_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "license_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "issue_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: LicenseStatus,
        default: LicenseStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], ComplianceLicense.prototype, "document_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ComplianceLicense.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ComplianceLicense.prototype, "updated_at", void 0);
exports.ComplianceLicense = ComplianceLicense = __decorate([
    (0, typeorm_1.Entity)("compliance_licenses")
], ComplianceLicense);
//# sourceMappingURL=compliance_licensing.entity.js.map