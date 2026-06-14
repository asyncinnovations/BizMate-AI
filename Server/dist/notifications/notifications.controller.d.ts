import { NotificationsService } from "./notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create_notification(body: any): Promise<{
        message: string;
        response: import("./notifications.entity").Notification;
    }>;
    send_notification(id: string): Promise<{
        message: string;
        response: import("./notifications.entity").Notification | {
            message: string;
        };
    }>;
    user_notification(user_id: string, limit?: string): Promise<{
        message: string;
        response: import("./notifications.entity").Notification[];
    }>;
    unread_count(user_id: string): Promise<{
        message: string;
        count: number;
    }>;
    single_notification(id: string): Promise<{
        message: string;
        response: import("./notifications.entity").Notification;
    }>;
    mark_read_notification(id: string): Promise<{
        message: string;
        response: import("./notifications.entity").Notification;
    }>;
    mark_all_read(user_id: string): Promise<{
        message: string;
        response: {
            message: string;
        };
    }>;
    send_bulk_notification(body: {
        notifications: any[];
    }): Promise<{
        message: string;
        response: any[];
    }>;
    delete_notification(id: string): Promise<{
        message: string;
        response: {
            message: string;
        };
    }>;
}
