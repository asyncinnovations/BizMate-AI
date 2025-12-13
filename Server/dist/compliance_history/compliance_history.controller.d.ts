import { ComplianceHistoryService } from "./compliance_history.service";
export declare class ComplianceHistoryController {
    private readonly historyService;
    constructor(historyService: ComplianceHistoryService);
    log_event(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    log_document_uploaded(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    logAiSummary(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    logReminder(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    logDocumentVerified(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    logDocumentRejected(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    logAiChat(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    logLicenseRenewed(body: any, req: any): Promise<import("./compliance_history.entity").ComplianceHistory>;
    getUserHistory(req: any): Promise<import("./compliance_history.entity").ComplianceHistory[]>;
    getDocumentHistory(documentId: string): Promise<import("./compliance_history.entity").ComplianceHistory[]>;
    getReminderHistory(reminderId: string): Promise<import("./compliance_history.entity").ComplianceHistory[]>;
    getByEventType(eventType: string): Promise<import("./compliance_history.entity").ComplianceHistory[]>;
    deleteHistoryEntry(uuid: string): Promise<import("typeorm").DeleteResult>;
    clearUserHistory(req: any): Promise<import("typeorm").DeleteResult>;
}
