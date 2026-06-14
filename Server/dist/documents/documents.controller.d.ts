import { DocumentsService } from "./documents.service";
import { PdfService } from "src/services/PdfService";
import { DocumentSource } from "./documents.entity";
export declare class DocumentsController {
    private readonly documentsService;
    private readonly pdfService;
    constructor(documentsService: DocumentsService, pdfService: PdfService);
    create_document(body: any): Promise<{
        message: string;
        document: import("./documents.entity").GeneratedDocumentEntity;
    }>;
    ai_generate_document(body: any): Promise<{
        message: string;
        ai_result: any;
        user_id: string;
        source: DocumentSource;
        ai_prompt: string;
    }>;
    save_ai_document(body: any): Promise<{
        message: string;
        document: import("./documents.entity").GeneratedDocumentEntity;
    }>;
    user_documents(user_id: string, status?: string, category?: string, documentType?: string, search?: string): Promise<{
        message: string;
        count: number;
        data: import("./documents.entity").GeneratedDocumentEntity[];
    }>;
    recent_documents(user_id: string, limit?: number): Promise<{
        message: string;
        data: import("./documents.entity").GeneratedDocumentEntity[];
    }>;
    single_document(uuid: string): Promise<{
        message: string;
        data: import("./documents.entity").GeneratedDocumentEntity;
    }>;
    update_document(uuid: string, body: any): Promise<{
        message: string;
        data: import("./documents.entity").GeneratedDocumentEntity;
    }>;
    update_document_status(uuid: string, status: string): Promise<{
        message: string;
        uuid: string;
        status: string;
        activity_log: {
            status: string;
            timestamp: string;
        }[];
    }>;
    delete_document(uuid: string): Promise<{
        message: string;
    }>;
    duplicate_document(body: {
        document_uuid: string;
        user_id: string;
    }): Promise<{
        message: string;
        document: import("./documents.entity").GeneratedDocumentEntity;
    }>;
    run_compliance_check(uuid: string): Promise<{
        message: string;
        uuid: string;
        compliance_score: any;
        compliance_notes: any;
    }>;
    get_ai_suggestions(user_id: string): Promise<{
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
    generate_pdf(uuid: string): Promise<{
        message: string;
        url: string;
        uuid: string;
    }>;
}
