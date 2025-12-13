import { NotificationsService } from "./notifications.service";
import { Notification, NotificationStatus } from "./notifications.entity";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(body: any): Promise<Notification>;
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
