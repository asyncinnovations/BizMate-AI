import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { EmployeePayrollService } from "./employee_payroll.service";

@Controller("payroll_employees")
export class EmployeePayrollController {
  constructor(private readonly payrollService: EmployeePayrollService) {}

  //====================================
  // GET ALL EMPLOYEES BY USER ID
  //====================================
  @Get("user_employee/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_all_employees_by_user_id_controller(
    @Param("user_id") user_id: string,
  ) {
    try {
      const response =
        await this.payrollService.get_all_employees_by_user_id_service(user_id);
      return { message: "Employees retrieved successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE EMPLOYEE BY UUID
  ///////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async get_single_employee_by_uuid_controller(@Param("id") id: string) {
    try {
      const response =
        await this.payrollService.get_single_employee_by_uuid_service(id);
      return { message: "Employee record retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  ///////////////////////////////////////////////////////
  // CREATE NEW EMPLOYEE
  ///////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_employee_controller(@Body() dto: any) {
    try {
      const response = await this.payrollService.create_employee_service(dto);
      return { message: "Employee created successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // UPDATE EMPLOYEE DETAILS
  ///////////////////////////////////////////////////////
  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_employee_details_controller(
    @Param("id") id: string,
    @Body() dto: any,
  ) {
    try {
      const response =
        await this.payrollService.update_employee_details_service(id, dto);
      return { message: "Employee updated successfully", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // TOGGLE EMPLOYEE STATUS
  ///////////////////////////////////////////////////////
  @Patch("status/:id")
  @HttpCode(HttpStatus.OK)
  async toggle_employee_status_controller(@Param("id") id: string) {
    try {
      const response =
        await this.payrollService.toggle_employee_status_service(id);
      return { message: "Employee status toggled", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET ALL PAYROLL RUNS BY USER ID
  ///////////////////////////////////////////////////////
  @Get("runs/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_all_payroll_runs_by_user_id_controller(
    @Param("user_id") user_id: string,
  ) {
    try {
      const response =
        await this.payrollService.get_all_payroll_runs_by_user_id_service(
          user_id,
        );
      return { message: "Payroll runs retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET SINGLE PAYROLL RUN WITH BREAKDOWN
  ///////////////////////////////////////////////////////
  @Get("runs/single/:id")
  @HttpCode(HttpStatus.OK)
  async get_single_payroll_run_with_breakdown_controller(
    @Param("id") id: string,
  ) {
    try {
      const response =
        await this.payrollService.get_single_payroll_run_with_breakdown_service(
          id,
        );
      return { message: "Payroll run breakdown retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET PAYROLL HISTORY BY EMPLOYEE UUID
  ///////////////////////////////////////////////////////
  @Get("runs/employee/:employee_uuid")
  @HttpCode(HttpStatus.OK)
  async get_payroll_history_by_employee_uuid_controller(
    @Param("employee_uuid") employee_uuid: string,
  ) {
    try {
      const response =
        await this.payrollService.get_payroll_history_by_employee_uuid_service(
          employee_uuid,
        );
      return { message: "Employee payroll history retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // CREATE DRAFT PAYROLL RUN
  ///////////////////////////////////////////////////////
  @Post("runs/create/:user_id")
  @HttpCode(HttpStatus.CREATED)
  async create_draft_payroll_run_controller(
    @Param("user_id") user_id: string,
    @Body() dto: any,
  ) {
    try {
      const response =
        await this.payrollService.create_draft_payroll_run_service(
          user_id,
          dto,
        );
      return { message: "Draft run created", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // APPROVE AND PROCESS PAYROLL RUN
  ///////////////////////////////////////////////////////
  @Patch("runs/approve/:id")
  @HttpCode(HttpStatus.OK)
  async approve_and_process_payroll_run_controller(@Param("id") id: string) {
    try {
      const response =
        await this.payrollService.approve_and_process_payroll_run_service(id);
      return { message: "Payroll run finalized", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // DOWNLOAD EMPLOYEE PAYSLIP PDF
  ///////////////////////////////////////////////////////
  @Get("runs/payslip/:run_uuid/:employee_uuid")
  @HttpCode(HttpStatus.OK)
  async download_employee_payslip_pdf_controller(
    @Param("run_uuid") run_uuid: string,
    @Param("employee_uuid") employee_uuid: string,
  ) {
    try {
      const response =
        await this.payrollService.download_employee_payslip_pdf_service(
          run_uuid,
          employee_uuid,
        );
      return { message: "Payslip data retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // DOWNLOAD FINAL WPS FILE
  ///////////////////////////////////////////////////////
  @Get("runs/wps/:run_uuid")
  @HttpCode(HttpStatus.OK)
  async download_final_wps_file_controller(
    @Param("run_uuid") run_uuid: string,
  ) {
    try {
      const response =
        await this.payrollService.download_final_wps_file_service(run_uuid);
      return { message: "WPS file generated", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // VALIDATE WPS COMPLIANCE
  ///////////////////////////////////////////////////////
  @Get("runs/validate/:run_uuid")
  @HttpCode(HttpStatus.OK)
  async validate_wps_compliance_controller(
    @Param("run_uuid") run_uuid: string,
  ) {
    try {
      const response =
        await this.payrollService.validate_wps_compliance_service(run_uuid);
      return { message: "WPS compliance checked", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // ADD PAYROLL ADJUSTMENT
  ///////////////////////////////////////////////////////
  @Post("runs/adjustment")
  @HttpCode(HttpStatus.OK)
  async add_payroll_adjustment_controller(
    @Body("run_uuid") run_uuid: string,
    @Body("employee_uuid") employee_uuid: string,
    @Body("amount") amount: number,
    @Body("reason") reason: string,
  ) {
    try {
      const response = await this.payrollService.add_payroll_adjustment_service(
        run_uuid,
        employee_uuid,
        amount,
        reason,
      );
      return { message: "Adjustment added to payroll", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  ///////////////////////////////////////////////////////
  // GET PAYROLL SUMMARY STATS
  ///////////////////////////////////////////////////////
  @Get("analytics/summary/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_payroll_summary_stats_controller(
    @Param("user_id") user_id: string,
    @Query("year") year: number,
  ) {
    try {
      const response =
        await this.payrollService.get_payroll_summary_stats_service(
          user_id,
          year,
        );
      return { message: "Annual summary retrieved", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////////////////
  // DELETE EMPLOYEE (SOFT DELETE)
  ///////////////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_employee_keep_history_controller(@Param("id") id: string) {
    try {
      const response =
        await this.payrollService.delete_employee_keep_history_service(id);
      return { message: "Employee deleted (history preserved)", response };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
