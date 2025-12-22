import { NotificationsService } from "./notifications.service";
import { Notification } from "./notifications.entity";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create_notification(body: any): Promise<{
        message: string;
        response: Notification;
    }>;
    send_notification(notification_id: string): Promise<{
        message: string;
        response: Notification | {
            message: string;
        };
    }>;
    user_notification(user_id: string, company_id?: string): Promise<{
        message: string;
        response: Notification[];
    }>;
    single_notification(notification_id: string): Promise<{
        message: string;
        response: Notification;
    }>;
    mark_read_notification(notification_id: string): Promise<{
        message: string;
        response: Notification;
    }>;
    send_bulk_notification(notifications: Notification[]): Promise<{
        message: string;
        response: any;
    }>;
    delete_notification(notification_id: string): Promise<{
        message: string;
        response: {
            message: string;
        };
    }>;
}
