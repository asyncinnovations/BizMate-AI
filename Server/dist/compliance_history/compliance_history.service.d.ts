import { Repository } from "typeorm";
import { ComplianceHistory } from "./compliance_history.entity";
export declare class ComplianceHistoryService {
    private readonly historyRepository;
    constructor(historyRepository: Repository<ComplianceHistory>);
    log_event_service(user_id: string, event_type: string, details: string, document_id?: string, reminder_id?: string, company_id?: string): Promise<ComplianceHistory>;
    log_document_uploaded_service(user_id: string, document_id: string, filename: string): Promise<ComplianceHistory>;
    log_ai_summary_generated_service(user_id: string, document_id: string): Promise<ComplianceHistory>;
    log_reminder_triggered_service(user_id: string, reminder_id: string, reminder_title: string): Promise<ComplianceHistory>;
    log_document_verified_service(user_id: string, document_id: string): Promise<ComplianceHistory>;
    log_document_rejected_service(user_id: string, document_id: string, reason: string): Promise<ComplianceHistory>;
    log_ai_chat_service(user_id: string, question: string): Promise<ComplianceHistory>;
    log_license_renewed_service(user_id: string, license_id: string, license_type: string): Promise<ComplianceHistory>;
    get_user_history_service(user_id: string): Promise<ComplianceHistory[]>;
    get_document_history_service(document_id: string): Promise<ComplianceHistory[]>;
    get_reminder_history_service(reminder_id: string): Promise<ComplianceHistory[]>;
    get_by_event_type_service(event_type: string): Promise<ComplianceHistory[]>;
    delete_history_entry_service(id: string): Promise<import("typeorm").DeleteResult>;
    clear_user_history_service(user_id: string): Promise<import("typeorm").DeleteResult>;
}
