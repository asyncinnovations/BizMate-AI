import { Repository } from "typeorm";
import { QuotationEntity, QuotationStatus, QuotationSource } from "./quotations.entity";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";
export declare class QuotationsService {
    private readonly quotationsRepo;
    private readonly gptService;
    private readonly promptService;
    constructor(quotationsRepo: Repository<QuotationEntity>, gptService: GPTService, promptService: PromptService);
    private append_log;
    private generate_quotation_number;
    private calculate_totals;
    create_quotation_service(data: {
        user_id: string;
        project_title?: string;
        description?: string;
        client_id?: string;
        client_name: string;
        client_email?: string;
        client_address?: string;
        client_phone?: string;
        currency?: string;
        line_items: any[];
        issue_date: string;
        expiry_date: string;
        terms_and_conditions?: string;
        notes?: string;
        source?: QuotationSource;
    }): Promise<any>;
    ai_generate_quotation_service(user_id: string, prompt: string): Promise<{
        message: string;
        ai_result: any;
        user_id: string;
        source: QuotationSource;
        ai_prompt: string;
    }>;
    ai_save_quotation_service(data: {
        user_id: string;
        ai_prompt: string;
        project_title?: string;
        client_name: string;
        client_email?: string;
        client_address?: string;
        currency?: string;
        line_items: any[];
        issue_date: string;
        expiry_date: string;
        terms_and_conditions?: string;
        notes?: string;
    }): Promise<any>;
    user_quotations_service(user_id: string, filters?: {
        status?: string;
        search?: string;
        currency?: string;
    }): Promise<any>;
    single_quotation_service(uuid: string): Promise<any>;
    update_quotation_service(uuid: string, data: Partial<QuotationEntity>): Promise<any>;
    update_quotation_status_service(uuid: string, new_status: string, actor?: string): Promise<{
        message: string;
        uuid: string;
        status: string;
        activity_log: {
            status: string;
            timestamp: string;
            actor?: string;
        }[];
    }>;
    send_quotation_service(uuid: string): Promise<{
        message: string;
        uuid: string;
        status: QuotationStatus;
        public_token: any;
        public_url: string;
    }>;
    get_quotation_by_token_service(token: string): Promise<{
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
    }>;
    client_action_service(token: string, action: "accept" | "reject" | "comment", comment?: string): Promise<{
        message: string;
        uuid: any;
        status?: undefined;
    } | {
        message: string;
        uuid: any;
        status: QuotationStatus;
    }>;
    convert_to_invoice_service(uuid: string, user_id: string): Promise<{
        message: string;
        invoice_data: {
            user_id: any;
            customer_name: any;
            customer_email: any;
            customer_address: any;
            invoice_date: string;
            due_date: any;
            payment_terms: string;
            subtotal: any;
            vat: any;
            total: any;
            notes: any;
            status: string;
            source: string;
            invoice_items: any;
            quotation_uuid: any;
        };
        quotation_uuid: any;
    }>;
    mark_as_converted_service(quotation_uuid: string, invoice_uuid: string): Promise<{
        message: string;
        quotation_uuid: string;
        converted_invoice_id: string;
    }>;
    duplicate_quotation_service(uuid: string, user_id: string): Promise<{
        message: string;
        quotation: any;
    }>;
    delete_quotation_service(uuid: string): Promise<{
        message: string;
    }>;
    link_document_service(quotation_uuid: string, document: {
        document_uuid: string;
        document_type: string;
        document_name: string;
    }): Promise<{
        message: string;
        linked_documents: any[];
    }>;
    unlink_document_service(quotation_uuid: string, document_uuid: string): Promise<{
        message: string;
        linked_documents: any;
    }>;
    set_pdf_path_service(uuid: string, pdf_path: string): Promise<{
        message: string;
        uuid: string;
        pdf_path: string;
    }>;
    recent_quotations_service(user_id: string, limit?: number): Promise<any>;
    get_ai_suggestions_service(user_id: string): Promise<{
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
}
