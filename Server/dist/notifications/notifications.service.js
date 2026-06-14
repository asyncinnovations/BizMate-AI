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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const notifications_entity_1 = require("./notifications.entity");
const notification_preferences_entity_1 = require("../notification_preferences/notification_preferences.entity");
const ResendService_1 = require("../services/ResendService");
let NotificationsService = class NotificationsService {
    notificationRepository;
    preferenceRepository;
    resendService;
    constructor(notificationRepository, preferenceRepository, resendService) {
        this.notificationRepository = notificationRepository;
        this.preferenceRepository = preferenceRepository;
        this.resendService = resendService;
    }
    async create_notification_service(data) {
        const notification = this.notificationRepository.create(data);
        return await this.notificationRepository.save(notification);
    }
    async create_and_send_service(data) {
        const record = await this.create_notification_service({
            user_id: data.user_id,
            company_id: data.company_id,
            reminder_id: data.reminder_id,
            document_id: data.document_id,
            reference_id: data.reference_id,
            event_type: data.event_type,
            notification_type: data.notification_type,
            title: data.title,
            message: data.message,
        });
        const pref = await this.preferenceRepository.findOne({
            where: { user_id: data.user_id, event_type: data.event_type },
        }) ?? await this.preferenceRepository.findOne({
            where: { user_id: data.user_id, event_type: "general" },
        });
        const emailEnabled = pref ? pref.email_enabled !== false : true;
        const pushEnabled = pref ? pref.push_enabled !== false : true;
        if (data.notification_type === notifications_entity_1.NotificationType.EMAIL &&
            emailEnabled &&
            data.email_html &&
            data.user_email) {
            const result = await this.resendService.send({
                to: data.user_email,
                subject: data.email_subject ?? data.title,
                html: data.email_html,
                tags: [{ name: "event_type", value: data.event_type }],
            });
            record.status = result.success ? notifications_entity_1.NotificationStatus.SENT : notifications_entity_1.NotificationStatus.FAILED;
            if (result.success) {
                record.sent_at = new Date();
            }
            await this.notificationRepository.save(record);
        }
        else if (data.notification_type === notifications_entity_1.NotificationType.DASHBOARD) {
            record.status = notifications_entity_1.NotificationStatus.SENT;
            record.sent_at = new Date();
            await this.notificationRepository.save(record);
        }
        return record;
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
                event_type: notification.event_type ?? (notification.reminder_id ? "reminder" : "general"),
            },
        });
        const emailDisabled = notification.notification_type === notifications_entity_1.NotificationType.EMAIL && pref?.email_enabled === false;
        const pushDisabled = notification.notification_type === notifications_entity_1.NotificationType.PUSH && pref?.push_enabled === false;
        if (emailDisabled || pushDisabled) {
            notification.status = notifications_entity_1.NotificationStatus.FAILED;
            await this.notificationRepository.save(notification);
            return { message: "User preference disabled this notification" };
        }
        notification.status = notifications_entity_1.NotificationStatus.SENT;
        notification.sent_at = new Date();
        await this.notificationRepository.save(notification);
        return notification;
    }
    async user_notification_service(user_id, limit = 50) {
        return this.notificationRepository.find({
            where: { user_id },
            order: { created_at: "DESC" },
            take: limit,
        });
    }
    async unread_count_service(user_id) {
        return this.notificationRepository.count({
            where: { user_id, status: notifications_entity_1.NotificationStatus.PENDING },
        });
    }
    async mark_read_notification_service(notification_id) {
        const notification = await this.single_notification_service(notification_id);
        notification.status = notifications_entity_1.NotificationStatus.SENT;
        await this.notificationRepository.save(notification);
        return notification;
    }
    async mark_all_read_service(user_id) {
        await this.notificationRepository
            .createQueryBuilder()
            .update(notifications_entity_1.Notification)
            .set({ status: notifications_entity_1.NotificationStatus.SENT })
            .where("user_id = :user_id AND status = :status", {
            user_id,
            status: notifications_entity_1.NotificationStatus.PENDING,
        })
            .execute();
        return { message: "All notifications marked as read." };
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
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        ResendService_1.ResendService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map