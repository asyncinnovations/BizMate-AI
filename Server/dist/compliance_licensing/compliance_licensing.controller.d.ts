import { ComplianceLicensingService } from "./compliance_licensing.service";
import { ComplianceLicense } from "./compliance_licensing.entity";
export declare class ComplianceLicensingController {
    private readonly licensingService;
    constructor(licensingService: ComplianceLicensingService);
    create_license(body: any): Promise<ComplianceLicense>;
    get_user_licences(user_id: string, company_id?: string): Promise<ComplianceLicense[]>;
    get_single_licences(license_id: string): Promise<ComplianceLicense>;
    update_licences(license_id: string, updates: Partial<ComplianceLicense>): Promise<ComplianceLicense>;
    delete_licences(license_id: string): Promise<{
        message: string;
    }>;
    verify_licences(license_id: string): Promise<ComplianceLicense>;
    mark_expire_licences(license_id: string): Promise<ComplianceLicense>;
    suspend_licences(license_id: string): Promise<ComplianceLicense>;
    attach_licences_document(license_id: string, document_id: string): Promise<ComplianceLicense>;
    get_expired_licences(user_id: string, daysBefore?: number): Promise<ComplianceLicense[]>;
}
