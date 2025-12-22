export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed"
}
export declare enum NotificationType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    DASHBOARD = "dashboard"
}
export declare class Notification {
    id: number;
    uuid: string;
    user_id: string;
    company_id: string;
    reminder_id: string;
    document_id: string;
    notification_type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    sent_at: Date;
    created_at: Date;
    updated_at: Date;
}
