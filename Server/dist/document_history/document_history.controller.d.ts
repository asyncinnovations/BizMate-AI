import { DocumentHistoryService } from "./document_history.service";
export declare class DocumentHistoryController {
    private readonly service;
    constructor(service: DocumentHistoryService);
    create_document(body: any): Promise<{
        message: string;
        response: import("./document_history.entity").DocumentHistory;
    }>;
    get_document_by_uuid(uuid: string): Promise<{
        message: string;
        response: import("./document_history.entity").DocumentHistory | null;
    }>;
    get_documents_by_user(user_id: string): Promise<{
        message: string;
        response: import("./document_history.entity").DocumentHistory[];
    }>;
    search_documents(user_id: string, keyword: string): Promise<{
        message: string;
        response: import("./document_history.entity").DocumentHistory[];
    }>;
    update_status(uuid: string, status: "pending" | "processed" | "failed"): Promise<{
        message: string;
    }>;
    update_parsed_data(uuid: string, parsedData: any): Promise<{
        message: string;
    }>;
    delete_document(uuid: string): Promise<{
        message: string;
    }>;
    get_pending_documents(): Promise<{
        message: string;
        response: import("./document_history.entity").DocumentHistory[];
    }>;
    get_documents_expiring_within(days: number): Promise<{
        message: string;
        response: import("./document_history.entity").DocumentHistory[];
    }>;
}
