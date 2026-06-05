import { ComplianceDocumentsService } from "./compliance_documents.service";
import { DocumentHistoryService } from "src/document_history/document_history.service";
import { DocumentConverter } from "src/services/DocumentConverter";
export declare class ComplianceDocumentsController {
    private readonly service;
    private readonly document_service;
    private readonly document_converter;
    constructor(service: ComplianceDocumentsService, document_service: DocumentHistoryService, document_converter: DocumentConverter);
    upload_document(body: any, file?: Express.Multer.File): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument;
    }>;
    get_user_document(user_id: string, reminderId?: string): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument[];
    }>;
    get_single_document(doc_id: string): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument;
    }>;
    update_document(doc_id: string, updates: any): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument;
    }>;
    verify_document(doc_id: string): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument;
    }>;
    reject_document(doc_id: string): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument;
    }>;
    attach_ai_summary(doc_id: string): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument | {
            message: string;
        };
    }>;
    delete_document(doc_id: string): Promise<{
        message: string;
        response: import("./compliance_documents.entity").ComplianceDocument;
    }>;
}
