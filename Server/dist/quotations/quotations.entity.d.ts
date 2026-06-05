export declare enum QuotationStatus {
    DRAFT = "draft",
    SENT = "sent",
    VIEWED = "viewed",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    EXPIRED = "expired",
    CONVERTED = "converted",
    ARCHIVED = "archived"
}
export declare enum QuotationSource {
    MANUAL = "manual",
    AI = "ai",
    DUPLICATE = "duplicate"
}
export declare class QuotationEntity {
    id: number;
    uuid: string;
    user_id: string;
    quotation_number: string;
    project_title: string | null;
    description: string | null;
    client_id: string | null;
    client_name: string;
    client_email: string | null;
    client_address: string | null;
    client_phone: string | null;
    currency: string;
    subtotal: number;
    total_discount: number;
    total_tax: number;
    grand_total: number;
    line_items: {
        id: string;
        name: string;
        description?: string;
        quantity: number;
        unit?: string;
        unit_price: number;
        discount_pct: number;
        tax_pct: number;
        line_total: number;
    }[];
    issue_date: Date;
    expiry_date: Date;
    terms_and_conditions: string | null;
    notes: string | null;
    ai_prompt: string | null;
    status: QuotationStatus;
    source: QuotationSource;
    activity_log: {
        status: string;
        timestamp: string;
        actor?: string;
    }[];
    public_token: string | null;
    viewed_at: Date | null;
    client_action_at: Date | null;
    client_comment: string | null;
    converted_invoice_id: string | null;
    linked_documents: {
        document_uuid: string;
        document_type: string;
        document_name: string;
    }[];
    pdf_path: string | null;
    created_at: Date;
    updated_at: Date;
}
