import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
} from "@nestjs/common";

import { InvoiceSchedulesService } from './invoice_schedules.service';

@Controller("invoice-schedules")
export class InvoiceSchedulesController {
  constructor(
    private readonly invoiceSchedulesService: InvoiceSchedulesService,
  ) {}

  //====================================
  // CREATE INVOICE SCHEDULE
  //====================================
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_schedule_controller(@Body() dto: any) {
    try {
      const response =
        await this.invoiceSchedulesService.create_schedule_service(dto);

      return {
        message: "Schedule created successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //====================================
  // GET ALL SCHEDULES BY USER ID
  //====================================
  @Get("user/:user_id")
  @HttpCode(HttpStatus.OK)
  async all_schedules_controller(@Param("user_id") user_id: string) {
    try {
      const response =
        await this.invoiceSchedulesService.all_schedules_service(user_id);

      return {
        message: "Schedules retrieved successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //====================================
  // GET SINGLE SCHEDULE
  //====================================
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_schedule_controller(@Param("id") id: string) {
    try {
      const response =
        await this.invoiceSchedulesService.single_schedule_service(id);

      return {
        message: "Schedule retrieved successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //====================================
  // CANCEL SCHEDULE
  //====================================
  @Delete("cancel/:id")
  @HttpCode(HttpStatus.OK)
  async cancel_schedule_controller(@Param("id") id: string) {
    try {
      const response =
        await this.invoiceSchedulesService.cancel_schedule_service(id);

      return {
        message: "Schedule cancelled successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //====================================
  // RETRY FAILED SCHEDULE
  //====================================
  @Patch("retry/:id")
  @HttpCode(HttpStatus.OK)
  async retry_schedule_controller(@Param("id") id: string) {
    try {
      const response =
        await this.invoiceSchedulesService.retry_schedule_service(id);

      return {
        message: "Schedule retry triggered successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //====================================
  // MANUAL EXECUTE SCHEDULE (DEBUG)
  //====================================
  @Post("execute/:id")
  @HttpCode(HttpStatus.OK)
  async execute_schedule_controller(@Param("id") id: string) {
    try {
      const response =
        await this.invoiceSchedulesService.execute_schedule_service(id);

      return {
        message: "Schedule executed successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //====================================
  // RELOAD PENDING SCHEDULES (SYSTEM)
  //====================================
  @Post("reload")
  @HttpCode(HttpStatus.OK)
  async reload_pending_controller() {
    try {
      const response =
        await this.invoiceSchedulesService.load_pending_schedules_service();

      return {
        message: "Pending schedules reloaded successfully",
        response,
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
