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
exports.InvoiceEntity = exports.InvoiceSource = exports.InvoiceStatus = void 0;
const typeorm_1 = require("typeorm");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["SAVED"] = "saved";
    InvoiceStatus["SENT"] = "sent";
    InvoiceStatus["VIEWED"] = "viewed";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["UNPAID"] = "unpaid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["ARCHIVED"] = "archived";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
var InvoiceSource;
(function (InvoiceSource) {
    InvoiceSource["MANUAL"] = "manual";
    InvoiceSource["AI"] = "ai";
    InvoiceSource["DUPLICATE"] = "duplicate";
    InvoiceSource["TEMPLATE"] = "template";
    InvoiceSource["RECURRING"] = "recurring";
})(InvoiceSource || (exports.InvoiceSource = InvoiceSource = {}));
let InvoiceEntity = class InvoiceEntity {
    id;
    uuid;
    invoice_name;
    invoice_type;
    user_id;
    invoice_number;
    customer_name;
    customer_email;
    customer_address;
    invoice_date;
    due_date;
    payment_terms;
    subtotal;
    vat;
    total;
    notes;
    status;
    source;
    activity_log;
    custom_fields;
    invoice_items;
    invoice_pdf;
    created_at;
    updated_at;
};
exports.InvoiceEntity = InvoiceEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], InvoiceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "invoice_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "invoice_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true, default: null }),
    __metadata("design:type", Object)
], InvoiceEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: false }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "invoice_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "customer_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "customer_email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "customer_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: false }),
    __metadata("design:type", Date)
], InvoiceEntity.prototype, "invoice_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: false }),
    __metadata("design:type", Date)
], InvoiceEntity.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "payment_terms", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoiceEntity.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoiceEntity.prototype, "vat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric", precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoiceEntity.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        default: InvoiceStatus.DRAFT,
    }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        nullable: true,
        default: InvoiceSource.MANUAL,
    }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'", nullable: true }),
    __metadata("design:type", Array)
], InvoiceEntity.prototype, "activity_log", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'", nullable: true }),
    __metadata("design:type", Array)
], InvoiceEntity.prototype, "custom_fields", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", default: () => "'[]'", nullable: true }),
    __metadata("design:type", Array)
], InvoiceEntity.prototype, "invoice_items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InvoiceEntity.prototype, "invoice_pdf", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], InvoiceEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], InvoiceEntity.prototype, "updated_at", void 0);
exports.InvoiceEntity = InvoiceEntity = __decorate([
    (0, typeorm_1.Entity)("invoices")
], InvoiceEntity);
//# sourceMappingURL=invoices.entity.js.map