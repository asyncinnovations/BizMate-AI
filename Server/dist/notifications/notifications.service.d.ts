import { Repository } from "typeorm";
import { Notification, NotificationStatus, NotificationType } from "./notifications.entity";
import { NotificationPreference } from "src/notification_preferences/notification_preferences.entity";
export declare class NotificationsService {
    private readonly notificationRepository;
    private readonly preferenceRepository;
    constructor(notificationRepository: Repository<Notification>, preferenceRepository: Repository<NotificationPreference>);
    createNotification(data: {
        user_id: string;
        company_id?: string;
        reminder_id?: string;
        document_id?: string;
        notification_type: NotificationType;
        title?: string;
        message: string;
    }): Promise<Notification>;
    sendNotification(notification_id: string): Promise<Notification | {
        message: string;
    }>;
    getUserNotifications(user_id: string, company_id?: string): Promise<Notification[]>;
    getNotificationById(notification_id: string): Promise<Notification>;
    deleteNotification(notification_id: string): Promise<{
        message: string;
    }>;
    markAsRead(notification_id: string): Promise<Notification>;
    sendBulkNotifications(notifications: Notification[]): Promise<never[]>;
    getNotificationsByStatus(status: NotificationStatus): Promise<Notification[]>;
    getNotificationsByReminder(reminder_id: string): Promise<Notification[]>;
    getNotificationsByDocument(document_id: string): Promise<Notification[]>;
}
