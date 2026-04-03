"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePayrollModule = void 0;
const common_1 = require("@nestjs/common");
const employee_payroll_service_1 = require("./employee_payroll.service");
const employee_payroll_controller_1 = require("./employee_payroll.controller");
const typeorm_1 = require("@nestjs/typeorm");
const employee_payroll_entity_1 = require("./employee_payroll.entity");
let EmployeePayrollModule = class EmployeePayrollModule {
};
exports.EmployeePayrollModule = EmployeePayrollModule;
exports.EmployeePayrollModule = EmployeePayrollModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([employee_payroll_entity_1.EmployeePayroll])],
        providers: [employee_payroll_service_1.EmployeePayrollService],
        controllers: [employee_payroll_controller_1.EmployeePayrollController],
    })
], EmployeePayrollModule);
//# sourceMappingURL=employee_payroll.module.js.map