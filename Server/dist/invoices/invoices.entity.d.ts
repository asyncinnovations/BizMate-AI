export declare enum InvoiceStatus {
    DRAFT = "draft",
    SAVED = "saved",
    SENT = "sent",
    VIEWED = "viewed",
    PAID = "paid",
    UNPAID = "unpaid",
    OVERDUE = "overdue",
    ARCHIVED = "archived"
}
export declare enum InvoiceSource {
    MANUAL = "manual",
    AI = "ai",
    DUPLICATE = "duplicate",
    TEMPLATE = "template",
    RECURRING = "recurring"
}
export declare class InvoiceEntity {
    id: number;
    uuid: string;
    invoice_name: string | null;
    invoice_type: string | null;
    user_id: string | null;
    invoice_number: string;
    customer_name: string;
    customer_email: string;
    customer_address: string;
    invoice_date: Date;
    due_date: Date;
    payment_terms: string;
    subtotal: number;
    vat: number;
    total: number;
    notes: string;
    status: InvoiceStatus;
    source: InvoiceSource;
    activity_log: {
        status: string;
        timestamp: string;
    }[];
    custom_fields: object[];
    invoice_items: object[];
    invoice_pdf: string | null;
    created_at: Date;
    updated_at: Date;
}
