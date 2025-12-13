export declare enum DocumentStatus {
    UPLOADED = "uploaded",
    VERIFIED = "verified",
    REJECTED = "rejected",
    PENDING = "pending"
}
export declare class ComplianceDocument {
    id: number;
    uuid: string;
    user_id: string;
    reminder_id: string;
    document_type: string;
    filename: string;
    file_url: string;
    status: DocumentStatus;
    ai_summary?: string;
    uploadedAt: Date;
    updatedAt: Date;
}
