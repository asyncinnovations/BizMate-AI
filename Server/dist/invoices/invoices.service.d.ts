import { Repository } from "typeorm";
import { InvoiceEntity } from "./invoices.entity";
export declare class InvoicesService {
    private readonly invoicesRepo;
    constructor(invoicesRepo: Repository<InvoiceEntity>);
    create_invoice_service(data: Partial<InvoiceEntity>): Promise<InvoiceEntity>;
    all_invoices_service(query?: {
        search?: string;
        status?: string;
        user_id?: string;
    }): Promise<InvoiceEntity[]>;
    user_invoices_service(user_id: string): Promise<any>;
    single_invoice_service(idOrUuid: number | string): Promise<any>;
    update_invoice_service(idOrUuid: number | string, data: Partial<InvoiceEntity>): Promise<any>;
    update_custom_field_service(idOrUuid: number | string, customFields: Record<string, any>): Promise<any>;
    delete_invoices_service(idOrUuid: number | string): Promise<{
        message: string;
    }>;
    update_invoice_status_service(idOrUuid: number | string, status: string): Promise<any>;
    total_inovices_service(subtotal: number, vatRate: number): Promise<{
        vat: number;
        total: number;
    }>;
}
