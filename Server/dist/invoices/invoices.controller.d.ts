import { InvoicesService } from "./invoices.service";
import { InvoiceEntity } from "./invoices.entity";
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create_invoice(data: Partial<InvoiceEntity> & {
        items?: any[];
    }): Promise<{
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
}
