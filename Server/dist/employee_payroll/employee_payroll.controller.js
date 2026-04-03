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
exports.EmployeePayrollController = void 0;
const common_1 = require("@nestjs/common");
const employee_payroll_service_1 = require("./employee_payroll.service");
let EmployeePayrollController = class EmployeePayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async get_all_employees_by_user_id_controller(user_id) {
        try {
            const response = await this.payrollService.get_all_employees_by_user_id_service(user_id);
            return { message: "Employees retrieved successfully", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_single_employee_by_uuid_controller(id) {
        try {
            const response = await this.payrollService.get_single_employee_by_uuid_service(id);
            return { message: "Employee record retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async create_employee_controller(dto) {
        try {
            const response = await this.payrollService.create_employee_service(dto);
            return { message: "Employee created successfully", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update_employee_details_controller(id, dto) {
        try {
            const response = await this.payrollService.update_employee_details_service(id, dto);
            return { message: "Employee updated successfully", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async toggle_employee_status_controller(id) {
        try {
            const response = await this.payrollService.toggle_employee_status_service(id);
            return { message: "Employee status toggled", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_all_payroll_runs_by_user_id_controller(user_id) {
        try {
            const response = await this.payrollService.get_all_payroll_runs_by_user_id_service(user_id);
            return { message: "Payroll runs retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_single_payroll_run_with_breakdown_controller(id) {
        try {
            const response = await this.payrollService.get_single_payroll_run_with_breakdown_service(id);
            return { message: "Payroll run breakdown retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_payroll_history_by_employee_uuid_controller(employee_uuid) {
        try {
            const response = await this.payrollService.get_payroll_history_by_employee_uuid_service(employee_uuid);
            return { message: "Employee payroll history retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async create_draft_payroll_run_controller(user_id, dto) {
        try {
            const response = await this.payrollService.create_draft_payroll_run_service(user_id, dto);
            return { message: "Draft run created", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async approve_and_process_payroll_run_controller(id) {
        try {
            const response = await this.payrollService.approve_and_process_payroll_run_service(id);
            return { message: "Payroll run finalized", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async download_employee_payslip_pdf_controller(run_uuid, employee_uuid) {
        try {
            const response = await this.payrollService.download_employee_payslip_pdf_service(run_uuid, employee_uuid);
            return { message: "Payslip data retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async download_final_wps_file_controller(run_uuid) {
        try {
            const response = await this.payrollService.download_final_wps_file_service(run_uuid);
            return { message: "WPS file generated", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async validate_wps_compliance_controller(run_uuid) {
        try {
            const response = await this.payrollService.validate_wps_compliance_service(run_uuid);
            return { message: "WPS compliance checked", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async add_payroll_adjustment_controller(run_uuid, employee_uuid, amount, reason) {
        try {
            const response = await this.payrollService.add_payroll_adjustment_service(run_uuid, employee_uuid, amount, reason);
            return { message: "Adjustment added to payroll", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async get_payroll_summary_stats_controller(user_id, year) {
        try {
            const response = await this.payrollService.get_payroll_summary_stats_service(user_id, year);
            return { message: "Annual summary retrieved", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete_employee_keep_history_controller(id) {
        try {
            const response = await this.payrollService.delete_employee_keep_history_service(id);
            return { message: "Employee deleted (history preserved)", response };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.EmployeePayrollController = EmployeePayrollController;
__decorate([
    (0, common_1.Get)("user_employee/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "get_all_employees_by_user_id_controller", null);
__decorate([
    (0, common_1.Get)("single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "get_single_employee_by_uuid_controller", null);
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "create_employee_controller", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "update_employee_details_controller", null);
__decorate([
    (0, common_1.Patch)("status/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "toggle_employee_status_controller", null);
__decorate([
    (0, common_1.Get)("runs/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "get_all_payroll_runs_by_user_id_controller", null);
__decorate([
    (0, common_1.Get)("runs/single/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "get_single_payroll_run_with_breakdown_controller", null);
__decorate([
    (0, common_1.Get)("runs/employee/:employee_uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("employee_uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "get_payroll_history_by_employee_uuid_controller", null);
__decorate([
    (0, common_1.Post)("runs/create/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "create_draft_payroll_run_controller", null);
__decorate([
    (0, common_1.Patch)("runs/approve/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "approve_and_process_payroll_run_controller", null);
__decorate([
    (0, common_1.Get)("runs/payslip/:run_uuid/:employee_uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("run_uuid")),
    __param(1, (0, common_1.Param)("employee_uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "download_employee_payslip_pdf_controller", null);
__decorate([
    (0, common_1.Get)("runs/wps/:run_uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("run_uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "download_final_wps_file_controller", null);
__decorate([
    (0, common_1.Get)("runs/validate/:run_uuid"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("run_uuid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "validate_wps_compliance_controller", null);
__decorate([
    (0, common_1.Post)("runs/adjustment"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)("run_uuid")),
    __param(1, (0, common_1.Body)("employee_uuid")),
    __param(2, (0, common_1.Body)("amount")),
    __param(3, (0, common_1.Body)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "add_payroll_adjustment_controller", null);
__decorate([
    (0, common_1.Get)("analytics/summary/:user_id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "get_payroll_summary_stats_controller", null);
__decorate([
    (0, common_1.Delete)("delete/:id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeePayrollController.prototype, "delete_employee_keep_history_controller", null);
exports.EmployeePayrollController = EmployeePayrollController = __decorate([
    (0, common_1.Controller)("payroll_employees"),
    __metadata("design:paramtypes", [employee_payroll_service_1.EmployeePayrollService])
], EmployeePayrollController);
//# sourceMappingURL=employee_payroll.controller.js.map