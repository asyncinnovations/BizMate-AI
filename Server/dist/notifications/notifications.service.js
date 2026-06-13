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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const notifications_entity_1 = require("./notifications.entity");
const notification_preferences_entity_1 = require("../notification_preferences/notification_preferences.entity");
let NotificationsService = class NotificationsService {
    notificationRepository;
    preferenceRepository;
    constructor(notificationRepository, preferenceRepository) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
    }
    async create_notification_service(data) {
        const notification = this.notificationRepository.create(data);
        const result = await this.notificationRepository.save(notification);
        return result;
    }
    async send_notification_service(notification_id) {
        const notification = await this.notificationRepository.findOne({
            where: { uuid: notification_id },
        });
        if (!notification)
            throw new common_1.HttpException("Notification not found", 404);
        const pref = await this.preferenceRepository.findOne({
            where: {
                user_id: notification.user_id,
                event_type: notification.reminder_id ? "reminder" : "general",
            },
        });
        if ((notification.notification_type === notifications_entity_1.NotificationType.EMAIL &&
            pref?.email_enabled === false) ||
            (notification.notification_type === notifications_entity_1.NotificationType.SMS &&
                pref?.sms_enabled === false) ||
            (notification.notification_type === notifications_entity_1.NotificationType.PUSH &&
                pref?.push_enabled === false) ||
            (notification.notification_type === notifications_entity_1.NotificationType.DASHBOARD &&
                pref?.dashboard_enabled === false)) {
            notification.status = notifications_entity_1.NotificationStatus.FAILED;
            await this.notificationRepository.save(notification);
            return { message: "User preference disabled this notification" };
        }
        notification.status = notifications_entity_1.NotificationStatus.SENT;
        notification.sent_at = new Date();
        await this.notificationRepository.save(notification);
        return notification;
    }
    async user_notification_service(user_id, company_id) {
        return this.notificationRepository.find({
            where: { user_id, company_id },
            order: { created_at: "DESC" },
        });
    }
    async single_notification_service(notification_id) {
        const notification = await this.notificationRepository.findOne({
            where: { uuid: notification_id },
        });
        if (!notification)
            throw new common_1.HttpException("Notification not found", 404);
        return notification;
    }
    async delete_notification(notification_id) {
        const notification = await this.single_notification_service(notification_id);
        await this.notificationRepository.remove(notification);
        return { message: "Notification deleted successfully" };
    }
    async mark_read_notification_service(notification_id) {
        const notification = await this.single_notification_service(notification_id);
        notification.status = notifications_entity_1.NotificationStatus.SENT;
        await this.notificationRepository.save(notification);
        return notification;
    }
    async send_bulk_notification_service(notifications) {
        const results = [];
        for (const notif of notifications) {
            results.push(await this.send_notification_service(notif.uuid));
        }
        return results;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(notifications_entity_1.Notification)),
    __param(1, (0, typeorm_2.InjectRepository)(notification_preferences_entity_1.NotificationPreference)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _b : Object])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map