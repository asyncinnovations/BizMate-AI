export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    READ = "read",
    FAILED = "failed"
}
export declare enum NotificationType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    DASHBOARD = "dashboard"
}
export declare enum NotificationEventType {
    REMINDER = "reminder",
    INVOICE_PAID = "invoice_paid",
    INVOICE_SENT = "invoice_sent",
    QUOTATION_ACCEPTED = "quotation_accepted",
    QUOTATION_REJECTED = "quotation_rejected",
    QUOTATION_SENT = "quotation_sent",
    DOCUMENT_FINALISED = "document_finalised",
    SUBSCRIPTION_EXPIRING = "subscription_expiring",
    WELCOME = "welcome",
    GENERAL = "general"
}
export declare class Notification {
    id: number;
    uuid: string;
    user_id: string;
    company_id: string;
    reminder_id: string;
    document_id: string;
    reference_id: string;
    event_type: string;
    notification_type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    is_read: boolean;
    sent_at: Date;
    created_at: Date;
    updated_at: Date;
}
