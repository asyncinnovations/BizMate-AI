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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const notifications_entity_1 = require("./notifications.entity");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async createNotification(body) {
        return this.notificationsService.createNotification(body);
    }
    async sendNotification(notification_id) {
        return this.notificationsService.sendNotification(notification_id);
    }
    async getUserNotifications(user_id, company_id) {
        return this.notificationsService.getUserNotifications(user_id, company_id);
    }
    async getNotificationById(notification_id) {
        return this.notificationsService.getNotificationById(notification_id);
    }
    async deleteNotification(notification_id) {
        return this.notificationsService.deleteNotification(notification_id);
    }
    async markAsRead(notification_id) {
        return this.notificationsService.markAsRead(notification_id);
    }
    async sendBulkNotifications(notifications) {
        return this.notificationsService.sendBulkNotifications(notifications);
    }
    async getNotificationsByStatus(status) {
        return this.notificationsService.getNotificationsByStatus(status);
    }
    async getNotificationsByReminder(reminder_id) {
        return this.notificationsService.getNotificationsByReminder(reminder_id);
    }
    async getNotificationsByDocument(document_id) {
        return this.notificationsService.getNotificationsByDocument(document_id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Put)(":notification_id/send"),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("company_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Get)(":notification_id"),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationById", null);
__decorate([
    (0, common_1.Delete)(":notification_id"),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Put)(":notification_id/mark-read"),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)("bulk-send"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBulkNotifications", null);
__decorate([
    (0, common_1.Get)("status/:status"),
    __param(0, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationsByStatus", null);
__decorate([
    (0, common_1.Get)("reminder/:reminder_id"),
    __param(0, (0, common_1.Param)("reminder_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationsByReminder", null);
__decorate([
    (0, common_1.Get)("document/:document_id"),
    __param(0, (0, common_1.Param)("document_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationsByDocument", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)("notifications"),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map