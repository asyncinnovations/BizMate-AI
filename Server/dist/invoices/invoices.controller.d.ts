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
        invoice: InvoiceEntity;
    }>;
    user_invoices(user_id: string): Promise<any>;
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
        response: any;
        success: boolean;
        url: string;
    }>;
    send_invoice_to_email(body: any): Promise<{
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
