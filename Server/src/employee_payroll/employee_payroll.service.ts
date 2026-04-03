import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeePayroll } from "./employee_payroll.entity";

@Injectable()
export class EmployeePayrollService {
  constructor(
    @InjectRepository(EmployeePayroll)
    private readonly employeeRepo: Repository<EmployeePayroll>,
  ) {}

  ///////////////////////////////////////////////////////
  // GET ALL EMPLOYEES BY USER ID
  ///////////////////////////////////////////////////////
  async get_all_employees_by_user_id_service(userId: string) {
    return await this.employeeRepo.find({
      where: { user_id: userId as any },
    });
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE EMPLOYEE BY UUID
  ///////////////////////////////////////////////////////
  async get_single_employee_by_uuid_service(uuid: string) {
    const employee = await this.employeeRepo.findOne({
      where: { uuid: uuid as any },
    });
    if (!employee) throw new NotFoundException("Employee record not found");
    return employee;
  }

  ///////////////////////////////////////////////////////
  // CREATE NEW EMPLOYEE
  ///////////////////////////////////////////////////////
  async create_employee_service(dto: any) {
    const employee = this.employeeRepo.create(dto);
    return await this.employeeRepo.save(employee);
  }

  ///////////////////////////////////////////////////////
  // UPDATE EMPLOYEE DETAILS
  ///////////////////////////////////////////////////////
  async update_employee_details_service(uuid: string, dto: any) {
    const employee = await this.get_single_employee_by_uuid_service(uuid);
    Object.assign(employee, dto);
    return await this.employeeRepo.save(employee);
  }

  ///////////////////////////////////////////////////////
  // TOGGLE EMPLOYEE STATUS
  ///////////////////////////////////////////////////////
  async toggle_employee_status_service(uuid: string) {
    const employee = await this.get_single_employee_by_uuid_service(uuid);
    employee["is_active"] = !employee["is_active"];
    return await this.employeeRepo.save(employee);
  }

  ///////////////////////////////////////////////////////
  // DELETE EMPLOYEE (SOFT DELETE)
  ///////////////////////////////////////////////////////
  async delete_employee_keep_history_service(uuid: string) {
    const employee = await this.get_single_employee_by_uuid_service(uuid);
    return await this.employeeRepo.softDelete({ uuid: uuid as any });
  }

  ///////////////////////////////////////////////////////
  // GET ALL PAYROLL RUNS BY USER ID
  ///////////////////////////////////////////////////////
  async get_all_payroll_runs_by_user_id_service(userId: string) {
    return await this.employeeRepo.query(
      `SELECT * FROM payroll_runs WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE PAYROLL RUN WITH BREAKDOWN
  ///////////////////////////////////////////////////////
  async get_single_payroll_run_with_breakdown_service(uuid: string) {
    const runHeader = await this.employeeRepo.query(
      `SELECT * FROM payroll_runs WHERE uuid = $1 LIMIT 1`,
      [uuid],
    );
    const items = await this.employeeRepo.query(
      `SELECT * FROM payroll_run_items WHERE payroll_run_id = $1`,
      [uuid],
    );
    return { ...runHeader[0], items };
  }

  ///////////////////////////////////////////////////////
  // GET PAYROLL HISTORY BY EMPLOYEE UUID
  ///////////////////////////////////////////////////////
  async get_payroll_history_by_employee_uuid_service(employeeUuid: string) {
    return await this.employeeRepo.query(
      `SELECT * FROM payroll_run_items WHERE employee_payroll_id = $1 ORDER BY created_at DESC`,
      [employeeUuid],
    );
  }

  ///////////////////////////////////////////////////////
  // CREATE DRAFT PAYROLL RUN
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // CREATE DRAFT PAYROLL RUN
  ///////////////////////////////////////////////////////
  async create_draft_payroll_run_service(userId: string, dto: any) {
    // 1. Fetch active employees for this user
    const employees = await this.employeeRepo.find({
      where: { user_id: userId as any } as any,
    });

    if (employees.length === 0) {
      throw new BadRequestException("No active employees found for this user");
    }

    // 2. Insert into payroll_runs and get the UUID back (Postgres specific)
    const result = await this.employeeRepo.query(
      `INSERT INTO payroll_runs (user_id, status, month, year) 
       VALUES ($1, 'draft', $2, $3) 
       RETURNING uuid`,
      [userId, dto.month, dto.year],
    );

    const runUuid = result[0].uuid;

    // 3. Logic: You would typically loop through 'employees' here
    // and insert them into 'payroll_run_items' using runUuid.

    return {
      message: "Draft payroll run created successfully",
      run_uuid: runUuid,
      employee_count: employees.length,
    };
  }

  ///////////////////////////////////////////////////////
  // APPROVE AND PROCESS PAYROLL RUN
  ///////////////////////////////////////////////////////
  async approve_and_process_payroll_run_service(uuid: string) {
    return await this.employeeRepo.query(
      `UPDATE payroll_runs SET status = 'processed', processed_date = NOW() WHERE uuid = $1`,
      [uuid],
    );
  }

  ///////////////////////////////////////////////////////
  // DOWNLOAD EMPLOYEE PAYSLIP PDF
  ///////////////////////////////////////////////////////
  async download_employee_payslip_pdf_service(
    runUuid: string,
    employeeUuid: string,
  ) {
    const data = await this.employeeRepo.query(
      `SELECT * FROM payroll_run_items WHERE payroll_run_id = $1 AND employee_payroll_id = $2`,
      [runUuid, employeeUuid],
    );
    return data[0];
  }

  ///////////////////////////////////////////////////////
  // DOWNLOAD FINAL WPS FILE
  ///////////////////////////////////////////////////////
  async download_final_wps_file_service(runUuid: string) {
    const employeesInRun = await this.employeeRepo.query(
      `SELECT e.full_name, e.iban, i.basic_salary 
       FROM employee_payroll e 
       JOIN payroll_run_items i ON e.uuid = i.employee_payroll_id 
       WHERE i.payroll_run_id = $1`,
      [runUuid],
    );
    return employeesInRun;
  }

  ///////////////////////////////////////////////////////
  // VALIDATE WPS COMPLIANCE
  ///////////////////////////////////////////////////////
  async validate_wps_compliance_service(runUuid: string) {
    const invalidEntries = await this.employeeRepo.query(
      `SELECT full_name FROM employee_payroll 
       WHERE (iban IS NULL OR emirates_id IS NULL) 
       AND uuid IN (SELECT employee_payroll_id FROM payroll_run_items WHERE payroll_run_id = $1)`,
      [runUuid],
    );
    return { valid: invalidEntries.length === 0, errors: invalidEntries };
  }

  ///////////////////////////////////////////////////////
  // ADD PAYROLL ADJUSTMENT
  ///////////////////////////////////////////////////////
  async add_payroll_adjustment_service(
    runUuid: string,
    employeeUuid: string,
    amount: number,
    reason: string,
  ) {
    try {
      const result = await this.employeeRepo.query(
        `INSERT INTO payroll_adjustments (payroll_run_id, employee_payroll_id, amount, reason) 
         VALUES ($1, $2, $3, $4) 
         RETURNING uuid, created_at`,
        [runUuid, employeeUuid, amount, reason],
      );

      // result[0] contains the RETURNING data in Postgres
      return result[0];
    } catch (error: any) {
      // Handle Foreign Key violations (e.g., if runUuid doesn't exist)
      throw new BadRequestException(
        "Failed to add adjustment: " + error.message,
      );
    }
  }

  ///////////////////////////////////////////////////////
  // REFRESH DRAFT RUN TOTALS
  ///////////////////////////////////////////////////////
  async refresh_draft_run_totals_service(runUuid: string) {
    return await this.employeeRepo.query(
      `UPDATE payroll_run_items pri 
       JOIN employee_payroll ep ON pri.employee_uuid = ep.uuid 
       SET pri.basic_salary = ep.basic_salary 
       WHERE pri.run_uuid = ?`,
      [runUuid],
    );
  }

  ///////////////////////////////////////////////////////
  // GENERATE MOL SIF CONTENT
  ///////////////////////////////////////////////////////
  async generate_mol_sif_content_service(runUuid: string) {
    const records = await this.employeeRepo.query(
      `SELECT * FROM payroll_run_items WHERE run_uuid = ?`,
      [runUuid],
    );
    return records;
  }

  ///////////////////////////////////////////////////////
  // BULK UPDATE EMPLOYEE SALARIES
  ///////////////////////////////////////////////////////
  async bulk_update_employee_salaries_service(updates: any[]) {
    return await this.employeeRepo.manager.transaction(async (tm) => {
      for (const update of updates) {
        await tm.update(
          EmployeePayroll,
          { uuid: update.uuid },
          { basicSalary: update.amount },
        );
      }
    });
  }

  ///////////////////////////////////////////////////////
  // GET PAYROLL SUMMARY STATS
  ///////////////////////////////////////////////////////
  async get_payroll_summary_stats_service(userId: string, year: number) {
    return await this.employeeRepo.query(
      `SELECT SUM(total_amount) as annual_spend, COUNT(*) as total_runs 
       FROM payroll_runs WHERE user_id = ? AND year = ? AND status = 'processed'`,
      [userId, year],
    );
  }

  ///////////////////////////////////////////////////////
  // VALIDATE WPS READINESS
  ///////////////////////////////////////////////////////
  async validate_wps_readiness_service(runUuid: string) {
    const check = await this.employeeRepo.query(
      `SELECT COUNT(*) as count FROM payroll_run_items WHERE run_uuid = ?`,
      [runUuid],
    );
    return { is_ready: check[0].count > 0 };
  }
}
