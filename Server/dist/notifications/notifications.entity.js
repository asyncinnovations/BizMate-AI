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
exports.Notification = exports.NotificationEventType = exports.NotificationType = exports.NotificationStatus = void 0;
const typeorm_1 = require("typeorm");
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["READ"] = "read";
    NotificationStatus["FAILED"] = "failed";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["SMS"] = "sms";
    NotificationType["PUSH"] = "push";
    NotificationType["DASHBOARD"] = "dashboard";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationEventType;
(function (NotificationEventType) {
    NotificationEventType["REMINDER"] = "reminder";
    NotificationEventType["INVOICE_PAID"] = "invoice_paid";
    NotificationEventType["INVOICE_SENT"] = "invoice_sent";
    NotificationEventType["QUOTATION_ACCEPTED"] = "quotation_accepted";
    NotificationEventType["QUOTATION_REJECTED"] = "quotation_rejected";
    NotificationEventType["QUOTATION_SENT"] = "quotation_sent";
    NotificationEventType["DOCUMENT_FINALISED"] = "document_finalised";
    NotificationEventType["SUBSCRIPTION_EXPIRING"] = "subscription_expiring";
    NotificationEventType["WELCOME"] = "welcome";
    NotificationEventType["GENERAL"] = "general";
})(NotificationEventType || (exports.NotificationEventType = NotificationEventType = {}));
let Notification = class Notification {
    id;
    uuid;
    user_id;
    company_id;
    reminder_id;
    document_id;
    reference_id;
    event_type;
    notification_type;
    title;
    message;
    status;
    is_read;
    sent_at;
    created_at;
    updated_at;
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.Column)({ type: "integer", generated: "increment" }),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        type: "uuid",
        default: () => "gen_random_uuid()",
        unique: true,
    }),
    __metadata("design:type", String)
], Notification.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid" }),
    __metadata("design:type", String)
], Notification.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "company_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "reminder_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "document_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "reference_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 80,
        nullable: true,
        default: "general",
    }),
    __metadata("design:type", String)
], Notification.prototype, "event_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "notification_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "is_read", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Notification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Notification.prototype, "updated_at", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)("notifications")
], Notification);
//# sourceMappingURL=notifications.entity.js.map