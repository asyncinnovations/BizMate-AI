import { QuotationsService } from "./quotations.service";
import { InvoicesService } from "src/invoices/invoices.service";
import { EmailService } from "src/services/EmailService";
import { PdfService } from "src/services/PdfService";
import { QuotationSource } from "./quotations.entity";
export declare class QuotationsController {
    private readonly quotationsService;
    private readonly invoicesService;
    private readonly emailService;
    private readonly pdfService;
    constructor(quotationsService: QuotationsService, invoicesService: InvoicesService, emailService: EmailService, pdfService: PdfService);
    create_quotation(body: any): Promise<{
        message: string;
        quotation: import("./quotations.entity").QuotationEntity;
    }>;
    ai_generate_quotation(body: {
        user_id: string;
        prompt: string;
    }): Promise<{
        message: string;
        ai_result: any;
        user_id: string;
        source: QuotationSource;
        ai_prompt: string;
    }>;
    ai_save_quotation(body: any): Promise<{
        message: string;
        quotation: import("./quotations.entity").QuotationEntity;
    }>;
    user_quotations(user_id: string, status?: string, search?: string, currency?: string): Promise<{
        message: string;
        count: number;
        data: import("./quotations.entity").QuotationEntity[];
    }>;
    recent_quotations(user_id: string, limit?: number): Promise<{
        message: string;
        data: import("./quotations.entity").QuotationEntity[];
    }>;
    single_quotation(uuid: string): Promise<{
        message: string;
        data: import("./quotations.entity").QuotationEntity;
    }>;
    get_public_quotation(token: string): Promise<{
        message: string;
        data: {
            uuid: string;
            quotation_number: string;
            project_title: string | null;
            description: string | null;
            client_name: string;
            currency: string;
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
            subtotal: number;
            total_discount: number;
            total_tax: number;
            grand_total: number;
            issue_date: Date;
            expiry_date: Date;
            terms_and_conditions: string | null;
            notes: string | null;
            status: import("./quotations.entity").QuotationStatus.DRAFT | import("./quotations.entity").QuotationStatus.VIEWED | import("./quotations.entity").QuotationStatus.ACCEPTED | import("./quotations.entity").QuotationStatus.REJECTED | import("./quotations.entity").QuotationStatus.EXPIRED | import("./quotations.entity").QuotationStatus.CONVERTED | import("./quotations.entity").QuotationStatus.ARCHIVED;
        };
    }>;
    update_quotation(uuid: string, body: any): Promise<{
        message: string;
        data: import("./quotations.entity").QuotationEntity;
    }>;
    update_status(uuid: string, status: string, actor?: string): Promise<{
        message: string;
        uuid: string;
        status: string;
        activity_log: {
            status: string;
            timestamp: string;
            actor?: string;
        }[];
    }>;
    send_quotation(uuid: string, body: {
        email_to?: string;
        email_subject?: string;
        email_message?: string;
    }): Promise<{
        email_sent: boolean;
        message: string;
        uuid: string;
        status: import("./quotations.entity").QuotationStatus;
        public_token: any;
        public_url: string;
    }>;
    client_action(token: string, action: "accept" | "reject" | "comment", comment?: string): Promise<{
        message: string;
        uuid: string;
        status?: undefined;
    } | {
        message: string;
        uuid: string;
        status: import("./quotations.entity").QuotationStatus;
    }>;
    convert_to_invoice(body: {
        quotation_uuid: string;
        user_id: string;
    }): Promise<{
        message: string;
        quotation_uuid: string;
        invoice_uuid: string;
        invoice_number: string;
        invoice: import("../invoices/invoices.entity").InvoiceEntity;
    }>;
    generate_pdf(uuid: string): Promise<{
        message: string;
        url: string;
        uuid: string;
    }>;
    duplicate_quotation(body: {
        quotation_uuid: string;
        user_id: string;
    }): Promise<{
        message: string;
        quotation: import("./quotations.entity").QuotationEntity;
    }>;
    link_document(body: {
        quotation_uuid: string;
        document_uuid: string;
        document_type: string;
        document_name: string;
    }): Promise<{
        message: string;
        linked_documents: {
            document_uuid: string;
            document_type: string;
            document_name: string;
        }[];
    }>;
    unlink_document(body: {
        quotation_uuid: string;
        document_uuid: string;
    }): Promise<{
        message: string;
        linked_documents: {
            document_uuid: string;
            document_type: string;
            document_name: string;
        }[];
    }>;
    get_ai_suggestions(user_id: string): Promise<{
        message: string;
        suggestions: {
            type: string;
            message: string;
        }[];
        based_on?: undefined;
    } | {
        message: string;
        suggestions: any[];
        based_on: number;
    }>;
    delete_quotation(uuid: string): Promise<{
        message: string;
    }>;
}
