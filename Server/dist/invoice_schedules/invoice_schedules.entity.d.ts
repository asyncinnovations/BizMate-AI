export declare enum ScheduleType {
    ONE_TIME = "one_time",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare enum ScheduleStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SENT = "sent",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class InvoiceSchedule {
    id: string;
    user_id: string;
    invoice_id: string;
    recipient_email: string;
    type: ScheduleType;
    scheduled_at: Date;
    status: ScheduleStatus;
    attempts: number;
    last_error?: string;
    sent_at?: Date;
    created_at: Date;
    updated_at: Date;
}
