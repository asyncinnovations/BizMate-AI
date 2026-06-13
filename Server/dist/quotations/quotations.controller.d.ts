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
        quotation: any;
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
        quotation: any;
    }>;
    user_quotations(user_id: string, status?: string, search?: string, currency?: string): Promise<{
        message: string;
        count: any;
        data: any;
    }>;
    recent_quotations(user_id: string, limit?: number): Promise<{
        message: string;
        data: any;
    }>;
    single_quotation(uuid: string): Promise<{
        message: string;
        data: any;
    }>;
    get_public_quotation(token: string): Promise<{
        message: string;
        data: {
            uuid: any;
            quotation_number: any;
            project_title: any;
            description: any;
            client_name: any;
            currency: any;
            line_items: any;
            subtotal: any;
            total_discount: any;
            total_tax: any;
            grand_total: any;
            issue_date: any;
            expiry_date: any;
            terms_and_conditions: any;
            notes: any;
            status: any;
        };
    }>;
    update_quotation(uuid: string, body: any): Promise<{
        message: string;
        data: any;
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
        uuid: any;
        status?: undefined;
    } | {
        message: string;
        uuid: any;
        status: import("./quotations.entity").QuotationStatus;
    }>;
    convert_to_invoice(body: {
        quotation_uuid: string;
        user_id: string;
    }): Promise<{
        message: string;
        quotation_uuid: string;
        invoice_uuid: any;
        invoice_number: any;
        invoice: any;
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
        quotation: any;
    }>;
    link_document(body: {
        quotation_uuid: string;
        document_uuid: string;
        document_type: string;
        document_name: string;
    }): Promise<{
        message: string;
        linked_documents: any[];
    }>;
    unlink_document(body: {
        quotation_uuid: string;
        document_uuid: string;
    }): Promise<{
        message: string;
        linked_documents: any;
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
        based_on: any;
    }>;
    delete_quotation(uuid: string): Promise<{
        message: string;
    }>;
}
