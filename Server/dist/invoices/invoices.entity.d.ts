export declare class InvoiceEntity {
    id: number;
    uuid: string;
    user_id: string;
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
    status: string;
    custom_fields: object[];
    invoice_items: object[];
    created_at: Date;
    updated_at: Date;
}
