"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_payroll_entity_1 = require("./employee_payroll.entity");
let EmployeePayrollService = class EmployeePayrollService {
    employeeRepo;
    constructor(employeeRepo) {
        this.employeeRepo = employeeRepo;
    }
    async get_all_employees_by_user_id_service(userId) {
        return await this.employeeRepo.find({
            where: { user_id: userId },
        });
    }
    async get_single_employee_by_uuid_service(uuid) {
        const employee = await this.employeeRepo.findOne({
            where: { uuid: uuid },
        });
        if (!employee)
            throw new common_1.NotFoundException("Employee record not found");
        return employee;
    }
    async create_employee_service(dto) {
        const employee = this.employeeRepo.create(dto);
        return await this.employeeRepo.save(employee);
    }
    async update_employee_details_service(uuid, dto) {
        const employee = await this.get_single_employee_by_uuid_service(uuid);
        Object.assign(employee, dto);
        return await this.employeeRepo.save(employee);
    }
    async toggle_employee_status_service(uuid) {
        const employee = await this.get_single_employee_by_uuid_service(uuid);
        employee["is_active"] = !employee["is_active"];
        return await this.employeeRepo.save(employee);
    }
    async delete_employee_keep_history_service(uuid) {
        const employee = await this.get_single_employee_by_uuid_service(uuid);
        return await this.employeeRepo.softDelete({ uuid: uuid });
    }
    async get_all_payroll_runs_by_user_id_service(userId) {
        return await this.employeeRepo.query(`SELECT * FROM payroll_runs WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
    }
    async get_single_payroll_run_with_breakdown_service(uuid) {
        const runHeader = await this.employeeRepo.query(`SELECT * FROM payroll_runs WHERE uuid = $1 LIMIT 1`, [uuid]);
        const items = await this.employeeRepo.query(`SELECT * FROM payroll_run_items WHERE payroll_run_id = $1`, [uuid]);
        return { ...runHeader[0], items };
    }
    async get_payroll_history_by_employee_uuid_service(employeeUuid) {
        return await this.employeeRepo.query(`SELECT * FROM payroll_run_items WHERE employee_payroll_id = $1 ORDER BY created_at DESC`, [employeeUuid]);
    }
    async create_draft_payroll_run_service(userId, dto) {
        const employees = await this.employeeRepo.find({
            where: { user_id: userId },
        });
        if (employees.length === 0) {
            throw new common_1.BadRequestException("No active employees found for this user");
        }
        const result = await this.employeeRepo.query(`INSERT INTO payroll_runs (user_id, status, month, year) 
       VALUES ($1, 'draft', $2, $3) 
       RETURNING uuid`, [userId, dto.month, dto.year]);
        const runUuid = result[0].uuid;
        return {
            message: "Draft payroll run created successfully",
            run_uuid: runUuid,
            employee_count: employees.length,
        };
    }
    async approve_and_process_payroll_run_service(uuid) {
        return await this.employeeRepo.query(`UPDATE payroll_runs SET status = 'processed', processed_date = NOW() WHERE uuid = $1`, [uuid]);
    }
    async download_employee_payslip_pdf_service(runUuid, employeeUuid) {
        const data = await this.employeeRepo.query(`SELECT * FROM payroll_run_items WHERE payroll_run_id = $1 AND employee_payroll_id = $2`, [runUuid, employeeUuid]);
        return data[0];
    }
    async download_final_wps_file_service(runUuid) {
        const employeesInRun = await this.employeeRepo.query(`SELECT e.full_name, e.iban, i.basic_salary 
       FROM employee_payroll e 
       JOIN payroll_run_items i ON e.uuid = i.employee_payroll_id 
       WHERE i.payroll_run_id = $1`, [runUuid]);
        return employeesInRun;
    }
    async validate_wps_compliance_service(runUuid) {
        const invalidEntries = await this.employeeRepo.query(`SELECT full_name FROM employee_payroll 
       WHERE (iban IS NULL OR emirates_id IS NULL) 
       AND uuid IN (SELECT employee_payroll_id FROM payroll_run_items WHERE payroll_run_id = $1)`, [runUuid]);
        return { valid: invalidEntries.length === 0, errors: invalidEntries };
    }
    async add_payroll_adjustment_service(runUuid, employeeUuid, amount, reason) {
        try {
            const result = await this.employeeRepo.query(`INSERT INTO payroll_adjustments (payroll_run_id, employee_payroll_id, amount, reason) 
         VALUES ($1, $2, $3, $4) 
         RETURNING uuid, created_at`, [runUuid, employeeUuid, amount, reason]);
            return result[0];
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to add adjustment: " + error.message);
        }
    }
    async refresh_draft_run_totals_service(runUuid) {
        return await this.employeeRepo.query(`UPDATE payroll_run_items pri 
       JOIN employee_payroll ep ON pri.employee_uuid = ep.uuid 
       SET pri.basic_salary = ep.basic_salary 
       WHERE pri.run_uuid = ?`, [runUuid]);
    }
    async generate_mol_sif_content_service(runUuid) {
        const records = await this.employeeRepo.query(`SELECT * FROM payroll_run_items WHERE run_uuid = ?`, [runUuid]);
        return records;
    }
    async bulk_update_employee_salaries_service(updates) {
        return await this.employeeRepo.manager.transaction(async (tm) => {
            for (const update of updates) {
                await tm.update(employee_payroll_entity_1.EmployeePayroll, { uuid: update.uuid }, { basicSalary: update.amount });
            }
        });
    }
    async get_payroll_summary_stats_service(userId, year) {
        return await this.employeeRepo.query(`SELECT SUM(total_amount) as annual_spend, COUNT(*) as total_runs 
       FROM payroll_runs WHERE user_id = ? AND year = ? AND status = 'processed'`, [userId, year]);
    }
    async validate_wps_readiness_service(runUuid) {
        const check = await this.employeeRepo.query(`SELECT COUNT(*) as count FROM payroll_run_items WHERE run_uuid = ?`, [runUuid]);
        return { is_ready: check[0].count > 0 };
    }
};
exports.EmployeePayrollService = EmployeePayrollService;
exports.EmployeePayrollService = EmployeePayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_payroll_entity_1.EmployeePayroll)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeePayrollService);
//# sourceMappingURL=employee_payroll.service.js.map