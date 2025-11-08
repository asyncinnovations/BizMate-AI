import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Patch,
  Query,
  UseGuards,
  Req,
  Res,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { JwtGuard } from "src/guards/auth/auth.guard";
import { AiReminderService } from "./ai_reminder.service";
import { AiReminder } from "./ai_reminder.entity";

@Controller("ai_reminder")
@UseGuards(JwtGuard)
export class AiReminderController {
  constructor(private readonly reminderService: AiReminderService) {}

  //////////////////////////////////////////////////////
  // CREATE REMINDER
  //////////////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_reminder(@Body() body: any) {
    const data = {
      user_id: body.user_id,
      title: body.title,
      description: body.description,
      type: body.type,
      reminder_date: body.reminder_date,
      notify_before: body.notify_before,
      notify_channels: body.notify_channels || {},
      recurrence_rule: body.recurrence_rule,
      status: body.status,
    };
    const response = await this.reminderService.create_reminder_service(data);
    return { message: "reminder create success", response };
  }

  //////////////////////////////////////////////////////
  // GET ALL REMINDERS >> with filters
  //////////////////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_reminders(
    @Req() req,
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("from") from?: string,
    @Query("to") to?: string
  ) {
    const filters = { status, type, from, to };
    const response = await this.reminderService.all_reminders_service(
      req.user?.uuid,
      filters
    );
    return { message: "all reminders retrived", response };
  }

  //////////////////////////////////////////////////////
  // GET SINGLE REMINDER BY UUID
  //////////////////////////////////////////////////////
  @Get("user/:id")
  @HttpCode(HttpStatus.OK)
  async user_reminder(@Param("id") user_id: string) {
    const response = await this.reminderService.user_reminder_service(user_id);
    if (!response) throw new NotFoundException("Reminder not found");
    return { message: "user reminder retrived", response };
  }

  //////////////////////////////////////////////////////
  // GET SINGLE REMINDER BY UUID
  //////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_reminder(@Param("id") uuid: string) {
    const response = await this.reminderService.single_reminder_service(uuid);
    if (!response) throw new NotFoundException("Reminder not found");
    return { message: "single reminder retrived", response };
  }

  //////////////////////////////////////////////////////
  // UPDATE REMINDER
  //////////////////////////////////////////////////////
  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_reminder(@Param("id") reminder_id: string, @Body() body: any) {
    const data = {
      title: body.title,
      description: body.description,
      type: body.type,
      reminder_date: body.reminder_date,
      notify_before: body.notify_before,
      notify_channels: body.notify_channels || {},
      recurrence_rule: body.recurrence_rule,
      status: body.status,
    };
    const response = await this.reminderService.update_reminder_service(
      reminder_id,
      data
    );
    return { message: "reminder update success", response };
  }

  //////////////////////////////////////////////////////
  // UPDATE REMINDER STATUS
  //////////////////////////////////////////////////////
  @Patch("update/status/:id")
  @HttpCode(HttpStatus.OK)
  async update_reminder_status(
    @Param("id") reminder_id: string,
    @Body("status") status: "pending" | "sent" | "completed" | "missed"
  ) {
    const response = await this.reminderService.update_reminder_status_service(
      reminder_id,
      status
    );
    return { message: "reminder update success", response };
  }

  //////////////////////////////////////////////////////
  // GET UPCOMING REMINDERS
  //////////////////////////////////////////////////////
  @Get("upcoming") // this will return lists
  @HttpCode(HttpStatus.OK)
  async upcoming_reminders(@Query("daysAhead") daysAhead = 3) {
    const response = await this.reminderService.upcoming_reminder_service(
      Number(daysAhead)
    );
    return { message: "upcoming reminder retrived", response };
  }
  //////////////////////////////////////////////////////
  // GET RECURRING REMINDERS
  //////////////////////////////////////////////////////
  @Get("recurring/:id") // this will return lists
  @HttpCode(HttpStatus.OK)
  async recurring_reminders(@Param("id") user_id: any) {
    const response =
      await this.reminderService.recurring_reminder_servcie(user_id);
    return { message: "recurring reminder retrived", response };
  }

  ////////////////////////////////////////////////////////////////////
  // CREATE AI-GENERATED REMINDER
  ////////////////////////////////////////////////////////////////////
  @Post("ai-generated")
  @HttpCode(HttpStatus.CREATED)
  async create_ai_generated(@Req() req, @Body() body: any) {
    const data = {
      ...body,
      created_by_ai: true,
    };
    const response =
      await this.reminderService.generate_ai_reminder_service(data);
    return { message: "ai generated reminder", response };
  }

  //////////////////////////////////////////////////////
  // DELETE REMINDER
  //////////////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_reminder(@Param("id") uuid: string) {
    const response = await this.reminderService.delete_reminder_service(uuid);
    return { message: "reminder delete success", response };
  }
}
