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
    create_invoice(data: Partial<InvoiceEntity> & {
        items?: any[];
        gateway_name?: string;
    }): Promise<{
        message: string;
        invoice: any;
    }>;
    generate_ai_invoice(body: {
        prompt: string;
    }): Promise<{
        message: string;
        response: {
            message: string;
            data: any;
        };
    }>;
    user_invoices(user_id: string): Promise<any>;
    get_prebuild_invoice_template(): Promise<{
        message: string;
        response: any;
    }>;
    all_invoices(search?: string, status?: string, user_id?: string): Promise<any>;
    single_invoice(id: string): Promise<any>;
    update_invoice(id: string, data: Partial<InvoiceEntity>): Promise<any>;
    update_custom_fields(id: string, customFields: Record<string, any>): Promise<any>;
    delete_invoice(id: string): Promise<{
        message: string;
    }>;
    update_status(id: string, status: string): Promise<{
        message: string;
        uuid: any;
        status: string;
        activity_log: {
            status: string;
            timestamp: string;
        }[];
    }>;
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
        cc?: string;
        subject: string;
        message: string;
        send_at?: string;
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
    duplicate_invoice(body: {
        invoice_id: string;
        user_id: string;
    }): Promise<{
        message: string;
        invoice: any;
    }>;
    get_ai_insights(invoice_id: string): Promise<{
        message: string;
        insights: any;
    }>;
    get_ai_suggestions(user_id: string, customer_name: string): Promise<{
        message: string;
        suggestions: never[];
        payment_pattern: string;
        pricing_tip: string;
        professional_notes: string;
        overdue_count?: undefined;
        payment_rate?: undefined;
    } | {
        message: string;
        suggestions: {
            name: string;
            suggested_price: number;
            times_used: number;
        }[];
        payment_pattern: string;
        overdue_count: number;
        payment_rate: number;
        pricing_tip: string;
        professional_notes: string;
    }>;
}
