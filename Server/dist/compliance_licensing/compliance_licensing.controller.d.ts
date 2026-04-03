import { ComplianceLicensingService } from "./compliance_licensing.service";
import { ComplianceLicense } from "./compliance_licensing.entity";
export declare class ComplianceLicensingController {
    private readonly licensingService;
    constructor(licensingService: ComplianceLicensingService);
    create_license(body: any): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    get_user_licences(user_id: string, company_id?: string): Promise<{
        message: string;
        response: ComplianceLicense[];
    }>;
    get_single_licences(license_id: string): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    update_licences(license_id: string, updates: Partial<ComplianceLicense>): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    delete_licences(license_id: string): Promise<{
        message: string;
        response: {
            message: string;
        };
    }>;
    verify_licences(license_id: string): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    mark_expire_licences(license_id: string): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    suspend_licences(license_id: string): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    attach_licences_document(license_id: string, document_id: string): Promise<{
        message: string;
        response: ComplianceLicense;
    }>;
    get_expired_licences(user_id: string, daysBefore?: number): Promise<{
        message: string;
        response: ComplianceLicense[];
    }>;
}
