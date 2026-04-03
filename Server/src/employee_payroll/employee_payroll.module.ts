import { Module } from "@nestjs/common";
import { EmployeePayrollService } from "./employee_payroll.service";
import { EmployeePayrollController } from "./employee_payroll.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeePayroll } from "./employee_payroll.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeePayroll])],
  providers: [EmployeePayrollService],
  controllers: [EmployeePayrollController],
})
export class EmployeePayrollModule {}
 