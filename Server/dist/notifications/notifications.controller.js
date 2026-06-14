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
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async create_notification(body) {
        try {
            const response = await this.notificationsService.create_notification_service(body);
            return { message: "notification created", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async send_notification(id) {
        try {
            const response = await this.notificationsService.send_notification_service(id);
            return { message: "notification sent", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async user_notification(user_id, limit) {
        try {
            const response = await this.notificationsService.user_notification_service(user_id, limit ? parseInt(limit, 10) : 50);
            return { message: "user notifications retrieved", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async unread_count(user_id) {
        try {
            const count = await this.notificationsService.unread_count_service(user_id);
            return { message: "unread count retrieved", count };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async single_notification(id) {
        try {
            const response = await this.notificationsService.single_notification_service(id);
            return { message: "notification retrieved", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async mark_read_notification(id) {
        try {
            const response = await this.notificationsService.mark_read_notification_service(id);
            return { message: "notification marked as read", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async mark_all_read(user_id) {
        try {
            const response = await this.notificationsService.mark_all_read_service(user_id);
            return { message: "all notifications marked as read", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async send_bulk_notification(body) {
        try {
            const response = await this.notificationsService.send_bulk_notification_service(body.notifications ?? body);
            return { message: "bulk notifications sent", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete_notification(id) {
        try {
            const response = await this.notificationsService.delete_notification(id);
            return { message: "notification deleted", response };
        }
        catch (err) {
            throw new common_1.HttpException(err.message ?? err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "create_notification", null);
__decorate([
    (0, common_1.Put)("send/:notification_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "send_notification", null);
__decorate([
    (0, common_1.Get)("user/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "user_notification", null);
__decorate([
    (0, common_1.Get)("unread-count/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unread_count", null);
__decorate([
    (0, common_1.Get)("single/:notification_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "single_notification", null);
__decorate([
    (0, common_1.Put)("mark-read/:notification_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "mark_read_notification", null);
__decorate([
    (0, common_1.Put)("mark-all-read/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "mark_all_read", null);
__decorate([
    (0, common_1.Post)("bulk-send"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "send_bulk_notification", null);
__decorate([
    (0, common_1.Delete)("delete/:notification_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("notification_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "delete_notification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)("notifications"),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map