export declare class AiReminder {
    uuid: string;
    id: number;
    user_id: string;
    title: string;
    description?: string;
    type: "VAT" | "License" | "Payroll" | "Invoice" | "Quotation" | "Document" | "Custom";
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
    source: "manual" | "ai" | "invoice" | "quotation" | "document" | "compliance";
    reference_id: string | null;
    reference_type: string | null;
    ai_prompt: string | null;
    created_at: Date;
    updated_at: Date;
}
