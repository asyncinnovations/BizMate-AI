// src/ai_reminder/ai_reminder.controller.ts
// UPDATED — 3 new endpoints added at the bottom.
// All existing endpoints preserved exactly.

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
  BadRequestException,
} from "@nestjs/common";
import { JwtGuard }          from "src/guards/auth/auth.guard";
import { AiReminderService } from "./ai_reminder.service";
import { AiReminder }        from "./ai_reminder.entity";

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
      user_id:        body.user_id,
      title:          body.title,
      description:    body.description,
      type:           body.type,
      reminder_date:  body.reminder_date,
      notify_before:  body.notify_before,
      notify_channels: body.notify_channels || {},
      recurrence_rule: body.recurrence_rule,
      status:         body.status,
      // NEW fields — passed through if provided
      source:         body.source         ?? "manual",
      reference_id:   body.reference_id   ?? null,
      reference_type: body.reference_type ?? null,
      ai_prompt:      body.ai_prompt      ?? null,
    };
    const response = await this.reminderService.create_reminder_service(data);
    return { message: "Reminder created successfully.", response };
  }

  //////////////////////////////////////////////////////
  // GET ALL REMINDERS — with filters
  //////////////////////////////////////////////////////
  @Get("all")
  @HttpCode(HttpStatus.OK)
  async all_reminders(
    @Req()          req,
    @Query("status") status?: string,
    @Query("type")   type?:   string,
    @Query("from")   from?:   string,
    @Query("to")     to?:     string,
  ) {
    const filters  = { status, type, from, to };
    const response = await this.reminderService.all_reminders_service(
      req.user?.uuid,
      filters,
    );
    return { message: "All reminders retrieved.", response };
  }

  //////////////////////////////////////////////////////
  // GET REMINDERS BY USER ID
  //////////////////////////////////////////////////////
  @Get("user/:id")
  @HttpCode(HttpStatus.OK)
  async user_reminder(@Param("id") user_id: string) {
    const response = await this.reminderService.user_reminder_service(user_id);
    if (!response) throw new NotFoundException("Reminder not found");
    return { message: "User reminders retrieved.", response };
  }

  //////////////////////////////////////////////////////
  // GET SINGLE REMINDER BY UUID
  //////////////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async single_reminder(@Param("id") uuid: string) {
    const response = await this.reminderService.single_reminder_service(uuid);
    if (!response) throw new NotFoundException("Reminder not found");
    return { message: "Reminder retrieved.", response };
  }

  //////////////////////////////////////////////////////
  // UPDATE REMINDER
  //////////////////////////////////////////////////////
  @Put("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_reminder(@Param("id") reminder_id: string, @Body() body: any) {
    const data = {
      title:          body.title,
      description:    body.description,
      type:           body.type,
      reminder_date:  body.reminder_date,
      notify_before:  body.notify_before,
      notify_channels: body.notify_channels || {},
      recurrence_rule: body.recurrence_rule,
      status:         body.status,
      // NEW fields
      source:         body.source,
      reference_id:   body.reference_id,
      reference_type: body.reference_type,
      ai_prompt:      body.ai_prompt,
    };
    const response = await this.reminderService.update_reminder_service(
      reminder_id,
      data,
    );
    return { message: "Reminder updated successfully.", response };
  }

  //////////////////////////////////////////////////////
  // UPDATE REMINDER STATUS
  //////////////////////////////////////////////////////
  @Patch("update/status/:id")
  @HttpCode(HttpStatus.OK)
  async update_reminder_status(
    @Param("id")      reminder_id: string,
    @Body("status")   status: "pending" | "sent" | "completed" | "missed",
  ) {
    const response = await this.reminderService.update_reminder_status_service(
      reminder_id,
      status,
    );
    return { message: "Status updated successfully.", response };
  }

  //////////////////////////////////////////////////////
  // GET UPCOMING REMINDERS
  //////////////////////////////////////////////////////
  @Get("upcoming")
  @HttpCode(HttpStatus.OK)
  async upcoming_reminders(@Query("daysAhead") daysAhead = 3) {
    const response = await this.reminderService.upcoming_reminder_service(
      Number(daysAhead),
    );
    return { message: "Upcoming reminders retrieved.", response };
  }

  //////////////////////////////////////////////////////
  // GET RECURRING REMINDERS
  //////////////////////////////////////////////////////
  @Get("recurring/:id")
  @HttpCode(HttpStatus.OK)
  async recurring_reminders(@Param("id") user_id: any) {
    const response = await this.reminderService.recurring_reminder_servcie(user_id);
    return { message: "Recurring reminders retrieved.", response };
  }

  //////////////////////////////////////////////////////
  // CREATE AI-GENERATED REMINDER (legacy)
  //////////////////////////////////////////////////////
  @Post("ai-generated")
  @HttpCode(HttpStatus.CREATED)
  async create_ai_generated(@Req() req, @Body() body: any) {
    const data = { ...body, created_by_ai: true };
    const response = await this.reminderService.generate_ai_reminder_service(data);
    return { message: "AI generated reminder created.", response };
  }

  //////////////////////////////////////////////////////
  // DELETE REMINDER
  //////////////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_reminder(@Param("id") uuid: string) {
    const response = await this.reminderService.delete_reminder_service(uuid);
    return { message: "Reminder deleted successfully.", response };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NEW ENDPOINTS
  // ═══════════════════════════════════════════════════════════════════════════

  //////////////////////////////////////////////////////
  // NEW: AI GENERATE FROM NATURAL LANGUAGE PROMPT
  // POST /ai_reminder/ai-generate
  // Body: { user_id, prompt }
  // Returns a pre-filled reminder object for user review.
  // Does NOT save — user must call /create after reviewing.
  //////////////////////////////////////////////////////
  @Post("ai-generate")
  @HttpCode(HttpStatus.CREATED)
  async ai_generate_from_prompt(
    @Body("user_id") user_id: string,
    @Body("prompt")  prompt:  string,
  ) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    if (!prompt)  throw new BadRequestException("prompt is required.");

    return await this.reminderService.ai_generate_from_prompt_service(
      user_id,
      prompt,
    );
  }

  //////////////////////////////////////////////////////
  // NEW: GET AI SUGGESTIONS FROM CONNECTED MODULES
  // GET /ai_reminder/suggestions/:user_id
  // Returns suggested reminders detected from invoices,
  // quotations, and documents — nothing is saved automatically.
  //////////////////////////////////////////////////////
  @Get("suggestions/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_module_suggestions(@Param("user_id") user_id: string) {
    if (!user_id) throw new BadRequestException("user_id is required.");
    return await this.reminderService.get_module_suggestions_service(user_id);
  }

  //////////////////////////////////////////////////////
  // NEW: CREATE REMINDER FROM MODULE SUGGESTION
  // POST /ai_reminder/from-module
  // Body: { user_id, type, source, reference_id, reference_type,
  //         title, description?, reminder_date, notify_before?,
  //         notify_channels?, recurrence_rule? }
  // Called when user clicks "Create" on a suggestion card.
  // Prevents duplicate reminders for the same reference.
  //////////////////////////////////////////////////////
  @Post("from-module")
  @HttpCode(HttpStatus.CREATED)
  async create_from_module(@Body() body: any) {
    if (!body.user_id)       throw new BadRequestException("user_id is required.");
    if (!body.reference_id)  throw new BadRequestException("reference_id is required.");
    if (!body.title)         throw new BadRequestException("title is required.");
    if (!body.reminder_date) throw new BadRequestException("reminder_date is required.");

    return await this.reminderService.create_from_module_service(body);
  }
}
