import { Repository } from "typeorm";
import { ComplianceLicense } from "./compliance_licensing.entity";
export declare class ComplianceLicensingService {
    private readonly licenseRepository;
    constructor(licenseRepository: Repository<ComplianceLicense>);
    create_license_service(user_id: string, company_id: string, license_type: string, license_number?: string, issue_date?: string, expiry_date?: string, document_id?: string): Promise<any>;
    get_user_licences_service(user_id: string, company_id?: string): Promise<any>;
    single_licences_service(license_id: string): Promise<any>;
    update_licences_service(license_id: string, updates: Partial<ComplianceLicense>): Promise<any>;
    delete_licences_service(license_id: string): Promise<{
        message: string;
    }>;
    verify_licences_service(license_id: string): Promise<any>;
    mark_expire_licences_service(license_id: string): Promise<any>;
    suspend_licences_service(license_id: string): Promise<any>;
    attach_licences_document_service(license_id: string, document_id: string): Promise<any>;
    get_expired_licences_service(user_id: string, daysBefore?: number): Promise<any>;
}
