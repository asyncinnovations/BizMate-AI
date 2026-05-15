import { InvoicesService } from "./invoices.service";
import { InvoiceEntity } from "./invoices.entity";
import { PdfService } from "src/services/PdfService";
import { EmailService } from "src/services/EmailService";
import { UserPaymentGatewayService } from "src/user_payment_gateway/user_payment_gateway.service";
export declare class InvoicesController {
    private readonly invoicesService;
    private readonly pdfService;
    private readonly emailService;
    private readonly upgService;
    constructor(invoicesService: InvoicesService, pdfService: PdfService, emailService: EmailService, upgService: UserPaymentGatewayService);
    create_invoice(data: Partial<InvoiceEntity> | (any & {
        items?: any[];
    })): Promise<{
        message: string;
        invoice: {
            invoice_pdf: string;
            id: number;
            uuid: string;
            invoice_name: string;
            invoice_type: string;
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
            status: string;
            custom_fields: object[];
            invoice_items: object[];
            created_at: Date;
            updated_at: Date;
        };
    }>;
    generate_ai_invoice(body: {
        prompt: string;
    }): Promise<{
        message: string;
        response: {
            message: string;
            data: import("openai/resources/index.js").ChatCompletionMessage;
        };
    }>;
    user_invoices(user_id: string): Promise<any>;
    get_prebuild_invoice_template(): Promise<{
        message: string;
        response: InvoiceEntity[];
    }>;
    all_invoices(search?: string, status?: string, user_id?: string): Promise<InvoiceEntity[]>;
    single_invoice(id: string): Promise<any>;
    update_invoice(id: string, data: Partial<InvoiceEntity>): Promise<any>;
    update_custom_fields(id: string, customFields: Record<string, any>): Promise<any>;
    delete_invoice(id: string): Promise<{
        message: string;
    }>;
    update_status(id: string, status: string): Promise<any>;
    compute_totals(subtotal: number, vatRate: number): Promise<{
        vat: number;
        total: number;
    }>;
    preview_invoice(body: any): Promise<{
        response: string;
        success: boolean;
        url: string;
        result: any;
    }>;
    send_invoice_to_email(body: {
        invoiceId: string;
        to: string;
        cc: string;
        subject: string;
        message: string;
        send_at: string;
    }): Promise<{
        message: string;
        response: {
            success: boolean;
            response: any;
            error?: undefined;
        } | {
            success: boolean;
            error: any;
            response?: undefined;
        };
    }>;
}
