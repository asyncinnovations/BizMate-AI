import { EmployeePayrollService } from "./employee_payroll.service";
export declare class EmployeePayrollController {
    private readonly payrollService;
    constructor(payrollService: EmployeePayrollService);
    get_all_employees_by_user_id_controller(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    get_single_employee_by_uuid_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
    create_employee_controller(dto: any): Promise<{
        message: string;
        response: any;
    }>;
    update_employee_details_controller(id: string, dto: any): Promise<{
        message: string;
        response: any;
    }>;
    toggle_employee_status_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
    get_all_payroll_runs_by_user_id_controller(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    get_single_payroll_run_with_breakdown_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
    get_payroll_history_by_employee_uuid_controller(employee_uuid: string): Promise<{
        message: string;
        response: any;
    }>;
    create_draft_payroll_run_controller(user_id: string, dto: any): Promise<{
        message: string;
        response: {
            message: string;
            run_uuid: any;
            employee_count: any;
        };
    }>;
    approve_and_process_payroll_run_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
    download_employee_payslip_pdf_controller(run_uuid: string, employee_uuid: string): Promise<{
        message: string;
        response: any;
    }>;
    download_final_wps_file_controller(run_uuid: string): Promise<{
        message: string;
        response: any;
    }>;
    validate_wps_compliance_controller(run_uuid: string): Promise<{
        message: string;
        response: {
            valid: boolean;
            errors: any;
        };
    }>;
    add_payroll_adjustment_controller(run_uuid: string, employee_uuid: string, amount: number, reason: string): Promise<{
        message: string;
        response: any;
    }>;
    get_payroll_summary_stats_controller(user_id: string, year: number): Promise<{
        message: string;
        response: any;
    }>;
    delete_employee_keep_history_controller(id: string): Promise<{
        message: string;
        response: any;
    }>;
}
