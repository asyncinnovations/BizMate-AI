import { Repository } from "typeorm";
import { EmployeePayroll } from "./employee_payroll.entity";
export declare class EmployeePayrollService {
    private readonly employeeRepo;
    constructor(employeeRepo: Repository<EmployeePayroll>);
    get_all_employees_by_user_id_service(userId: string): Promise<any>;
    get_single_employee_by_uuid_service(uuid: string): Promise<any>;
    create_employee_service(dto: any): Promise<any>;
    update_employee_details_service(uuid: string, dto: any): Promise<any>;
    toggle_employee_status_service(uuid: string): Promise<any>;
    delete_employee_keep_history_service(uuid: string): Promise<any>;
    get_all_payroll_runs_by_user_id_service(userId: string): Promise<any>;
    get_single_payroll_run_with_breakdown_service(uuid: string): Promise<any>;
    get_payroll_history_by_employee_uuid_service(employeeUuid: string): Promise<any>;
    create_draft_payroll_run_service(userId: string, dto: any): Promise<{
        message: string;
        run_uuid: any;
        employee_count: any;
    }>;
    approve_and_process_payroll_run_service(uuid: string): Promise<any>;
    download_employee_payslip_pdf_service(runUuid: string, employeeUuid: string): Promise<any>;
    download_final_wps_file_service(runUuid: string): Promise<any>;
    validate_wps_compliance_service(runUuid: string): Promise<{
        valid: boolean;
        errors: any;
    }>;
    add_payroll_adjustment_service(runUuid: string, employeeUuid: string, amount: number, reason: string): Promise<any>;
    refresh_draft_run_totals_service(runUuid: string): Promise<any>;
    generate_mol_sif_content_service(runUuid: string): Promise<any>;
    bulk_update_employee_salaries_service(updates: any[]): Promise<any>;
    get_payroll_summary_stats_service(userId: string, year: number): Promise<any>;
    validate_wps_readiness_service(runUuid: string): Promise<{
        is_ready: boolean;
    }>;
}
