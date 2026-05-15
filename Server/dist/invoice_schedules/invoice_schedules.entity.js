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
exports.InvoiceSchedule = exports.ScheduleStatus = exports.ScheduleType = void 0;
const typeorm_1 = require("typeorm");
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["ONE_TIME"] = "one_time";
    ScheduleType["DAILY"] = "daily";
    ScheduleType["WEEKLY"] = "weekly";
    ScheduleType["MONTHLY"] = "monthly";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["PENDING"] = "pending";
    ScheduleStatus["PROCESSING"] = "processing";
    ScheduleStatus["SENT"] = "sent";
    ScheduleStatus["FAILED"] = "failed";
    ScheduleStatus["CANCELLED"] = "cancelled";
})(ScheduleStatus || (exports.ScheduleStatus = ScheduleStatus = {}));
let InvoiceSchedule = class InvoiceSchedule {
    id;
    user_id;
    invoice_id;
    recipient_email;
    type;
    scheduled_at;
    status;
    attempts;
    last_error;
    sent_at;
    created_at;
    updated_at;
};
exports.InvoiceSchedule = InvoiceSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "invoice_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "recipient_email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ScheduleType,
        default: ScheduleType.ONE_TIME,
    }),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", Date)
], InvoiceSchedule.prototype, "scheduled_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ScheduleStatus,
        default: ScheduleStatus.PENDING,
    }),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], InvoiceSchedule.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], InvoiceSchedule.prototype, "last_error", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], InvoiceSchedule.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], InvoiceSchedule.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], InvoiceSchedule.prototype, "updated_at", void 0);
exports.InvoiceSchedule = InvoiceSchedule = __decorate([
    (0, typeorm_1.Entity)("invoice_schedules"),
    (0, typeorm_1.Index)(["scheduled_at"]),
    (0, typeorm_1.Index)(["status"]),
    (0, typeorm_1.Index)(["invoice_id"])
], InvoiceSchedule);
//# sourceMappingURL=invoice_schedules.entity.js.map