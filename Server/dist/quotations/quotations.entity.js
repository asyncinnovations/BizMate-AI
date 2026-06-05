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
exports.QuotationEntity = exports.QuotationSource = exports.QuotationStatus = void 0;
const typeorm_1 = require("typeorm");
var QuotationStatus;
(function (QuotationStatus) {
    QuotationStatus["DRAFT"] = "draft";
    QuotationStatus["SENT"] = "sent";
    QuotationStatus["VIEWED"] = "viewed";
    QuotationStatus["ACCEPTED"] = "accepted";
    QuotationStatus["REJECTED"] = "rejected";
    QuotationStatus["EXPIRED"] = "expired";
    QuotationStatus["CONVERTED"] = "converted";
    QuotationStatus["ARCHIVED"] = "archived";
})(QuotationStatus || (exports.QuotationStatus = QuotationStatus = {}));
var QuotationSource;
(function (QuotationSource) {
    QuotationSource["MANUAL"] = "manual";
    QuotationSource["AI"] = "ai";
    QuotationSource["DUPLICATE"] = "duplicate";
})(QuotationSource || (exports.QuotationSource = QuotationSource = {}));
let QuotationEntity = class QuotationEntity {
    id;
    uuid;
    user_id;
    quotation_number;
    project_title;
    description;
    client_id;
    client_name;
    client_email;
    client_address;
    client_phone;
    currency;
    subtotal;
    total_discount;
    total_tax;
    grand_total;
    line_items;
    issue_date;
    expiry_date;
    terms_and_conditions;
    notes;
    ai_prompt;
    status;
    source;
    activity_log;
    public_token;
    viewed_at;
    client_action_at;
    client_comment;
    converted_invoice_id;
    linked_documents;
    pdf_path;
    created_at;
    updated_at;
};
exports.QuotationEntity = QuotationEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: false }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: false }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "quotation_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "project_title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: false }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "client_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "client_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "client_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "client_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, default: "AED" }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "total_discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "total_tax", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], QuotationEntity.prototype, "grand_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], QuotationEntity.prototype, "line_items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: false }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "issue_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: false }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "terms_and_conditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "ai_prompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: QuotationStatus.DRAFT }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, default: QuotationSource.MANUAL }),
    __metadata("design:type", String)
], QuotationEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], QuotationEntity.prototype, "activity_log", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true, default: null, unique: true }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "public_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "viewed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "client_action_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "client_comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "converted_invoice_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'" }),
    __metadata("design:type", Array)
], QuotationEntity.prototype, "linked_documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 500, nullable: true, default: null }),
    __metadata("design:type", Object)
], QuotationEntity.prototype, "pdf_path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], QuotationEntity.prototype, "updated_at", void 0);
exports.QuotationEntity = QuotationEntity = __decorate([
    (0, typeorm_1.Entity)("quotations")
], QuotationEntity);
//# sourceMappingURL=quotations.entity.js.map