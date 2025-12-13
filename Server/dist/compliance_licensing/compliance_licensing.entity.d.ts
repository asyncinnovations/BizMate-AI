export declare enum LicenseStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    SUSPENDED = "suspended"
}
export declare class ComplianceLicense {
    id: number;
    uuid: string;
    user_id: string;
    company_id: string;
    license_type: string;
    license_number: string;
    issue_date: string;
    expiry_date: string;
    status: LicenseStatus;
    document_id: string;
    created_at: Date;
    updated_at: Date;
}
