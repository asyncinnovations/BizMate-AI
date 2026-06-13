import { Repository } from "typeorm";
import { Notification, NotificationType } from "./notifications.entity";
import { NotificationPreference } from "src/notification_preferences/notification_preferences.entity";
export declare class NotificationsService {
    private readonly notificationRepository;
    private readonly preferenceRepository;
    constructor(notificationRepository: Repository<Notification>, preferenceRepository: Repository<NotificationPreference>);
    create_notification_service(data: {
        user_id: string;
        company_id?: string;
        reminder_id?: string;
        document_id?: string;
        notification_type: NotificationType;
        title?: string;
        message: string;
    }): Promise<any>;
    send_notification_service(notification_id: string): Promise<any>;
    user_notification_service(user_id: string, company_id?: string): Promise<any>;
    single_notification_service(notification_id: string): Promise<any>;
    delete_notification(notification_id: string): Promise<{
        message: string;
    }>;
    mark_read_notification_service(notification_id: string): Promise<any>;
    send_bulk_notification_service(notifications: any): Promise<any>;
}
