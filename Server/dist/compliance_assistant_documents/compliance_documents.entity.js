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
exports.ComplianceDocument = exports.DocumentStatus = void 0;
const typeorm_1 = require("typeorm");
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["UPLOADED"] = "uploaded";
    DocumentStatus["VERIFIED"] = "verified";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["PENDING"] = "pending";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let ComplianceDocument = class ComplianceDocument {
    id;
    uuid;
    user_id;
    reminder_id;
    document_type;
    filename;
    file_url;
    status;
    ai_summary;
    uploadedAt;
    updatedAt;
};
exports.ComplianceDocument = ComplianceDocument;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], ComplianceDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "reminder_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "document_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "file_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: DocumentStatus,
        default: DocumentStatus.UPLOADED,
    }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], ComplianceDocument.prototype, "ai_summary", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ComplianceDocument.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ComplianceDocument.prototype, "updatedAt", void 0);
exports.ComplianceDocument = ComplianceDocument = __decorate([
    (0, typeorm_1.Entity)("compliance_documents")
], ComplianceDocument);
//# sourceMappingURL=compliance_documents.entity.js.map