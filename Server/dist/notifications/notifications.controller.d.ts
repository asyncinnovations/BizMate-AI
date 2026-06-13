import { NotificationsService } from "./notifications.service";
import { Notification } from "./notifications.entity";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create_notification(body: any): Promise<{
        message: string;
        response: any;
    }>;
    send_notification(notification_id: string): Promise<{
        message: string;
        response: any;
    }>;
    user_notification(user_id: string, company_id?: string): Promise<{
        message: string;
        response: any;
    }>;
    single_notification(notification_id: string): Promise<{
        message: string;
        response: any;
    }>;
    mark_read_notification(notification_id: string): Promise<{
        message: string;
        response: any;
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
