import { ComplianceLicensingService } from "./compliance_licensing.service";
import { ComplianceLicense } from "./compliance_licensing.entity";
export declare class ComplianceLicensingController {
    private readonly licensingService;
    constructor(licensingService: ComplianceLicensingService);
    create_license(body: any): Promise<{
        message: string;
        response: any;
    }>;
    get_user_licences(user_id: string, company_id?: string): Promise<{
        message: string;
        response: any;
    }>;
    get_single_licences(license_id: string): Promise<{
        message: string;
        response: any;
    }>;
    update_licences(license_id: string, updates: Partial<ComplianceLicense>): Promise<{
        message: string;
        response: any;
    }>;
    delete_licences(license_id: string): Promise<{
        message: string;
        response: {
            message: string;
        };
    }>;
    verify_licences(license_id: string): Promise<{
        message: string;
        response: any;
    }>;
    mark_expire_licences(license_id: string): Promise<{
        message: string;
        response: any;
    }>;
    suspend_licences(license_id: string): Promise<{
        message: string;
        response: any;
    }>;
    attach_licences_document(license_id: string, document_id: string): Promise<{
        message: string;
        response: any;
    }>;
    get_expired_licences(user_id: string, daysBefore?: number): Promise<{
        message: string;
        response: any;
    }>;
}
