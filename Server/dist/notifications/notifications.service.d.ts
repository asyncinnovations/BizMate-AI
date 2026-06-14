import { Repository } from "typeorm";
import { Notification, NotificationType } from "./notifications.entity";
import { NotificationPreference } from "src/notification_preferences/notification_preferences.entity";
import { ResendService } from "src/services/ResendService";
export declare class NotificationsService {
    private readonly notificationRepository;
    private readonly preferenceRepository;
    private readonly resendService;
    constructor(notificationRepository: Repository<Notification>, preferenceRepository: Repository<NotificationPreference>, resendService: ResendService);
    create_notification_service(data: {
        user_id: string;
        company_id?: string;
        reminder_id?: string;
        document_id?: string;
        reference_id?: string;
        event_type?: string;
        notification_type: NotificationType;
        title?: string;
        message: string;
    }): Promise<Notification>;
    create_and_send_service(data: {
        user_id: string;
        user_email: string;
        user_full_name?: string;
        company_id?: string;
        reminder_id?: string;
        document_id?: string;
        reference_id?: string;
        event_type: string;
        notification_type: NotificationType;
        title: string;
        message: string;
        email_subject?: string;
        email_html?: string;
    }): Promise<Notification>;
    send_notification_service(notification_id: string): Promise<Notification | {
        message: string;
    }>;
    user_notification_service(user_id: string, limit?: number): Promise<Notification[]>;
    unread_count_service(user_id: string): Promise<number>;
    mark_read_notification_service(notification_id: string): Promise<Notification>;
    mark_all_read_service(user_id: string): Promise<{
        message: string;
    }>;
    single_notification_service(notification_id: string): Promise<Notification>;
    delete_notification(notification_id: string): Promise<{
        message: string;
    }>;
    send_bulk_notification_service(notifications: any[]): Promise<any[]>;
}
