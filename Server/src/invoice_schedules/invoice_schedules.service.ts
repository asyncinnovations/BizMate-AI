import { Injectable, BadRequestException, OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { SchedulerRegistry } from "@nestjs/schedule";

import { InvoiceSchedule, ScheduleStatus } from "./invoice_schedules.entity";

@Injectable()
export class InvoiceSchedulesService implements OnModuleInit {
  constructor(
    @InjectRepository(InvoiceSchedule)
    private readonly scheduleRepo: Repository<InvoiceSchedule>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    await this.load_pending_schedules_service();
  }

  // ==================================================
  // CREATE SCHEDULE (Raw SQL)
  // ==================================================
  async create_schedule_service(dto: any) {
    const query = `
      INSERT INTO invoice_schedules 
      (user_id, invoice_id, recipient_email, type, scheduled_at, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await this.scheduleRepo.query(query, [
      dto.user_id,
      dto.invoice_id,
      dto.recipient_email,
      dto.type,
      dto.scheduled_at,
      ScheduleStatus.PENDING,
    ]);

    const schedule = result[0];
    await this.register_schedule_service(schedule);
    return schedule;
  }

  // ==================================================
  // REGISTER CRON JOB
  // ==================================================
  async register_schedule_service(schedule: any) {
    const jobName = `invoice-schedule-${schedule.id}`;

    // Safety: Remove existing job with same name before adding
    this.remove_schedule_service(schedule.id);

    const job = new CronJob(new Date(schedule.scheduled_at), async () => {
      await this.execute_schedule_service(schedule.id);
    });

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }

  // ==================================================
  // EXECUTE SCHEDULE (Raw SQL Join)
  // ==================================================
  async execute_schedule_service(scheduleId: string) {
    const query = `
      SELECT s.*, i.id as invoice_id, i.invoice_number 
      FROM invoice_schedules s
      LEFT JOIN invoices i ON s.invoice_id = i.id
      WHERE s.id = $1
    `;

    const schedules = await this.scheduleRepo.query(query, [scheduleId]);
    const schedule = schedules[0];

    if (!schedule) return;

    try {
      await this.scheduleRepo.query(
        `UPDATE invoice_schedules SET status = $1 WHERE id = $2`,
        [ScheduleStatus.PROCESSING, scheduleId],
      );

      // 👉 SEND EMAIL LOGIC HERE
      // await this.mailService.sendInvoice(schedule.recipient_email, schedule);

      await this.scheduleRepo.query(
        `UPDATE invoice_schedules SET status = $1, sent_at = NOW() WHERE id = $2`,
        [ScheduleStatus.SENT, scheduleId],
      );

      this.remove_schedule_service(scheduleId);
    } catch (error: any) {
      await this.handle_failed_schedule_service(scheduleId, error);
    }
  }

  // ==================================================
  // RETRY SCHEDULE (Raw SQL)
  // ==================================================
  async retry_schedule_service(scheduleId: string) {
    const result = await this.scheduleRepo.query(
      `UPDATE invoice_schedules SET status = $1 WHERE id = $2 RETURNING *`,
      [ScheduleStatus.PENDING, scheduleId],
    );

    const schedule = result[0];
    if (!schedule) throw new BadRequestException("Schedule not found");

    await this.register_schedule_service(schedule);
    return schedule;
  }

  // ==================================================
  // GET SINGLE SCHEDULE (Raw SQL Join)
  // ==================================================
  async single_schedule_service(scheduleId: string) {
    const result = await this.scheduleRepo.query(
      `SELECT s.*, i.invoice_number 
       FROM invoice_schedules s
       LEFT JOIN invoices i ON s.invoice_id = i.id
       WHERE s.id = $1`,
      [scheduleId],
    );
    return result[0] || null;
  }

  // ==================================================
  // LOAD PENDING SCHEDULES
  // ==================================================
  async load_pending_schedules_service() {
    // Only load schedules that are still in the future
    const query = `SELECT * FROM invoice_schedules WHERE status = $1 AND scheduled_at > NOW()`;
    const schedules = await this.scheduleRepo.query(query, [
      ScheduleStatus.PENDING,
    ]);

    for (const schedule of schedules) {
      await this.register_schedule_service(schedule);
    }
  }

  // ==================================================
  // HANDLE FAILED (Raw SQL)
  // ==================================================
  async handle_failed_schedule_service(scheduleId: string, error: any) {
    const query = `
      UPDATE invoice_schedules 
      SET attempts = attempts + 1, last_error = $1, status = $2 
      WHERE id = $3
    `;
    await this.scheduleRepo.query(query, [
      error?.message || "Unknown error",
      ScheduleStatus.FAILED,
      scheduleId,
    ]);
  }

  // ==================================================
  // CANCEL SCHEDULE
  // ==================================================
  async cancel_schedule_service(scheduleId: string) {
    const result = await this.scheduleRepo.query(
      `UPDATE invoice_schedules SET status = $1 WHERE id = $2 RETURNING id`,
      [ScheduleStatus.CANCELLED, scheduleId],
    );

    if (result.length === 0)
      throw new BadRequestException("Schedule not found");
    this.remove_schedule_service(scheduleId);
    return { success: true };
  }

  // ==================================================
  // REMOVE CRON JOB
  // ==================================================
  remove_schedule_service(scheduleId: string) {
    const jobName = `invoice-schedule-${scheduleId}`;
    try {
      this.schedulerRegistry.deleteCronJob(jobName);
    } catch (e) {}
  }

  // ==================================================
  // GET ALL SCHEDULES
  // ==================================================
  async all_schedules_service(userId: string) {
    return await this.scheduleRepo.query(
      `SELECT s.*, i.invoice_number 
       FROM invoice_schedules s 
       LEFT JOIN invoices i ON s.invoice_id = i.id 
       WHERE s.user_id = $1 
       ORDER BY s.scheduled_at ASC`,
      [userId],
    );
  }
}
