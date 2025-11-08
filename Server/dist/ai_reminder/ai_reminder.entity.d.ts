export declare class AiReminder {
    uuid: string;
    id: number;
    user_id: string;
    title: string;
    description?: string;
    type: "VAT" | "License" | "Payroll" | "Custom";
    reminder_date: Date;
    notify_before: number;
    notify_channels: {
        email: boolean;
        whatsapp: boolean;
        push: boolean;
    };
    notified: boolean;
    recurrence_rule: "none" | "monthly" | "quarterly" | "yearly";
    status: "pending" | "sent" | "completed" | "missed";
    created_at: Date;
    updated_at: Date;
}
