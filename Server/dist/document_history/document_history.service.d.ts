import { Repository } from "typeorm";
import { DocumentHistory } from "./document_history.entity";
export declare class DocumentHistoryService {
    private readonly documentRepo;
    constructor(documentRepo: Repository<DocumentHistory>);
    create_document_service(data: {
        user_id: string;
        file_name: string;
        file_type: string;
        file_size: number;
        raw_text?: string;
        parsed_data?: any;
        storage_path?: string;
    }): Promise<DocumentHistory>;
    get_document_by_uuid_service(uuid: string): Promise<DocumentHistory | null>;
    get_documents_by_user_service(user_id: string): Promise<DocumentHistory[]>;
    search_documents_service(user_id: string, keyword: string): Promise<DocumentHistory[]>;
    update_status_service(uuid: string, status: "pending" | "processed" | "failed"): Promise<void>;
    update_parsed_data_service(uuid: string, parsedData: any): Promise<void>;
    delete_document_service(uuid: string): Promise<void>;
    get_pending_documents_service(): Promise<DocumentHistory[]>;
    get_documents_expiring_within_service(days: number): Promise<DocumentHistory[]>;
}
