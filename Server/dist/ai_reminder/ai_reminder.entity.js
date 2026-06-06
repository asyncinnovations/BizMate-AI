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
exports.AiReminder = void 0;
const typeorm_1 = require("typeorm");
let AiReminder = class AiReminder {
    uuid;
    id;
    user_id;
    title;
    description;
    type;
    reminder_date;
    notify_before;
    notify_channels;
    notified;
    recurrence_rule;
    status;
    source;
    reference_id;
    reference_type;
    ai_prompt;
    created_at;
    updated_at;
};
exports.AiReminder = AiReminder;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], AiReminder.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], AiReminder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], AiReminder.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], AiReminder.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], AiReminder.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["VAT", "License", "Payroll", "Invoice", "Quotation", "Document", "Custom"],
        default: "Custom",
    }),
    __metadata("design:type", String)
], AiReminder.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], AiReminder.prototype, "reminder_date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "integer",
        default: 3,
        comment: "Days before reminder_date to send the notification (1–30)",
    }),
    __metadata("design:type", Number)
], AiReminder.prototype, "notify_before", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        default: () => `'{"email": true, "whatsapp": false, "push": true}'`,
    }),
    __metadata("design:type", Object)
], AiReminder.prototype, "notify_channels", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], AiReminder.prototype, "notified", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["none", "monthly", "quarterly", "yearly"],
        default: "none",
    }),
    __metadata("design:type", String)
], AiReminder.prototype, "recurrence_rule", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["pending", "sent", "completed", "missed"],
        default: "pending",
    }),
    __metadata("design:type", String)
], AiReminder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["manual", "ai", "invoice", "quotation", "document", "compliance"],
        default: "manual",
    }),
    __metadata("design:type", String)
], AiReminder.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true, default: null }),
    __metadata("design:type", Object)
], AiReminder.prototype, "reference_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true, default: null }),
    __metadata("design:type", Object)
], AiReminder.prototype, "reference_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true, default: null }),
    __metadata("design:type", Object)
], AiReminder.prototype, "ai_prompt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], AiReminder.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], AiReminder.prototype, "updated_at", void 0);
exports.AiReminder = AiReminder = __decorate([
    (0, typeorm_1.Entity)("ai_reminders")
], AiReminder);
//# sourceMappingURL=ai_reminder.entity.js.map