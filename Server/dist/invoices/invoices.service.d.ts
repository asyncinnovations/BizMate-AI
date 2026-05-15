import { Repository } from "typeorm";
import { InvoiceEntity } from "./invoices.entity";
import { PromptService } from "src/services/PromptService";
import { GPTService } from "src/services/GPTService";
export declare class InvoicesService {
    private readonly invoicesRepo;
    private readonly openAIService;
    private readonly promptservice;
    constructor(invoicesRepo: Repository<InvoiceEntity>, openAIService: GPTService, promptservice: PromptService);
    create_invoice_service(data: Partial<InvoiceEntity>): Promise<InvoiceEntity>;
    set_invoice_pdf_path_service(path: string, uuid: string): Promise<import("typeorm").UpdateResult>;
    generate_ai_invoice_service(prompt: string): Promise<{
        message: string;
        response: {
            message: string;
            data: import("openai/resources/index.js").ChatCompletionMessage;
        };
    }>;
    get_prebuild_invoice_template_service(): Promise<InvoiceEntity[]>;
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
