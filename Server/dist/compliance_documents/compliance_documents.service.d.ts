import { Repository } from "typeorm";
import { ComplianceDocument } from "./compliance_documents.entity";
import { PdfService } from "src/services/PdfService";
import { OpenAIService } from "src/services/OpenAIService";
export declare class ComplianceDocumentsService {
    private readonly documentRepository;
    private readonly pdf_service;
    private readonly Openai_service;
    constructor(documentRepository: Repository<ComplianceDocument>, pdf_service: PdfService, Openai_service: OpenAIService);
    upload_document_service(data: any): Promise<any>;
    get_user_document_service(userId: string, reminderId?: string): Promise<any>;
    get_single_document_service(documentId: string): Promise<any>;
    update_document_service(documentId: string, updates: Partial<ComplianceDocument>): Promise<any>;
    verify_document_service(documentId: string): Promise<any>;
    reject_document_service(documentId: string): Promise<any>;
    attach_ai_summary_service(documentId: string): Promise<any>;
    delete_document_service(documentId: string): Promise<any>;
}
