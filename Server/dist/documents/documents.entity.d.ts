export declare enum DocumentStatus {
    DRAFT = "draft",
    AI_GENERATED = "ai_generated",
    UNDER_REVIEW = "under_review",
    APPROVED = "approved",
    FINALISED = "finalised",
    ARCHIVED = "archived"
}
export declare enum DocumentSource {
    TEMPLATE = "template",
    AI = "ai",
    CUSTOM = "custom"
}
export declare class GeneratedDocumentEntity {
    uuid: string;
    id: number;
    user_id: string;
    template_id: string | null;
    document_name: string;
    category: string;
    document_type: string;
    field_values: Record<string, any>;
    content: string;
    ai_prompt: string;
    compliance_score: number | null;
    compliance_notes: {
        type: string;
        message: string;
    }[];
    status: DocumentStatus;
    source: DocumentSource;
    activity_log: {
        status: string;
        timestamp: string;
    }[];
    pdf_path: string | null;
    docx_path: string | null;
    created_at: Date;
    updated_at: Date;
}
