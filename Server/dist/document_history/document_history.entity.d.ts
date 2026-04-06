export declare class DocumentHistory {
    uuid: string;
    user_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    raw_text: string;
    parsed_data?: {
        license_no?: string;
        expiry_date?: string;
        company_name?: string;
        [key: string]: any;
    };
    status: "pending" | "processed" | "failed";
    storage_path?: string;
    uploaded_at: Date;
    updated_at: Date;
}
