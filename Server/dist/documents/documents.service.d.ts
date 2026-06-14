import { Repository } from "typeorm";
import { GeneratedDocumentEntity, DocumentSource } from "./documents.entity";
import { TemplateEntity } from "../templates/templates.entity";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";
export declare class DocumentsService {
    private readonly docsRepo;
    private readonly templateRepo;
    private readonly gptService;
    private readonly promptService;
    constructor(docsRepo: Repository<GeneratedDocumentEntity>, templateRepo: Repository<TemplateEntity>, gptService: GPTService, promptService: PromptService);
    private append_log;
    create_document_service(data: {
        user_id: string;
        template_id?: string;
        document_name: string;
        category?: string;
        document_type?: string;
        field_values: Record<string, any>;
        content?: string;
        source?: DocumentSource;
    }): Promise<GeneratedDocumentEntity>;
    ai_generate_document_service(user_id: string, prompt: string, document_type?: string): Promise<{
        message: string;
        ai_result: any;
        user_id: string;
        source: DocumentSource;
        ai_prompt: string;
    }>;
    save_ai_document_service(data: {
        user_id: string;
        document_name: string;
        document_type?: string;
        category?: string;
        content: string;
        ai_prompt: string;
        field_values?: Record<string, any>;
        compliance_score?: number;
        compliance_notes?: {
            type: string;
            message: string;
        }[];
    }): Promise<GeneratedDocumentEntity>;
    user_documents_service(user_id: string, filters?: {
        status?: string;
        category?: string;
        document_type?: string;
        search?: string;
    }): Promise<GeneratedDocumentEntity[]>;
    single_document_service(uuid: string): Promise<GeneratedDocumentEntity>;
    update_document_service(uuid: string, data: Partial<GeneratedDocumentEntity>): Promise<GeneratedDocumentEntity>;
    update_document_status_service(uuid: string, new_status: string): Promise<{
        message: string;
        uuid: string;
        status: string;
        activity_log: {
            status: string;
            timestamp: string;
        }[];
    }>;
    delete_document_service(uuid: string): Promise<{
        message: string;
    }>;
    duplicate_document_service(uuid: string, user_id: string): Promise<{
        message: string;
        document: GeneratedDocumentEntity;
    }>;
    run_compliance_check_service(uuid: string): Promise<{
        message: string;
        uuid: string;
        compliance_score: any;
        compliance_notes: any;
    }>;
    get_ai_suggestions_service(user_id: string): Promise<{
        message: string;
        suggestions: {
            document_type: string;
            reason: string;
        }[];
        based_on?: undefined;
    } | {
        message: string;
        suggestions: any[];
        based_on: number;
    }>;
    set_document_file_paths_service(uuid: string, paths: {
        pdf_path?: string;
        docx_path?: string;
    }): Promise<{
        pdf_path?: string;
        docx_path?: string;
        message: string;
        uuid: string;
    }>;
    recent_documents_service(user_id: string, limit?: number): Promise<GeneratedDocumentEntity[]>;
}
