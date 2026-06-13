import { ComplianceHistoryService } from "./compliance_history.service";
export declare class ComplianceHistoryController {
    private readonly historyService;
    constructor(historyService: ComplianceHistoryService);
    log_event(body: any, req: any): Promise<any>;
    log_document_uploaded(body: any, req: any): Promise<any>;
    logAiSummary(body: any, req: any): Promise<any>;
    logReminder(body: any, req: any): Promise<any>;
    logDocumentVerified(body: any, req: any): Promise<any>;
    logDocumentRejected(body: any, req: any): Promise<any>;
    logAiChat(body: any): Promise<any>;
    logLicenseRenewed(body: any, req: any): Promise<any>;
    getUserHistory(req: any): Promise<any>;
    getDocumentHistory(documentId: string): Promise<any>;
    getReminderHistory(reminderId: string): Promise<any>;
    getByEventType(eventType: string): Promise<any>;
    deleteHistoryEntry(uuid: string): Promise<any>;
    clearUserHistory(req: any): Promise<any>;
}
