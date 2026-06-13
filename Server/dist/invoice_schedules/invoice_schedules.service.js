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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const cron_1 = require("cron");
const schedule_1 = require("@nestjs/schedule");
const invoice_schedules_entity_1 = require("./invoice_schedules.entity");
let InvoiceSchedulesService = class InvoiceSchedulesService {
    scheduleRepo;
    schedulerRegistry;
    constructor(scheduleRepo, schedulerRegistry) {
        this.scheduleRepo = scheduleRepo;
        this.schedulerRegistry = schedulerRegistry;
    }
    async onModuleInit() {
        await this.load_pending_schedules_service();
    }
    async create_schedule_service(dto) {
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
            invoice_schedules_entity_1.ScheduleStatus.PENDING,
        ]);
        const schedule = result[0];
        await this.register_schedule_service(schedule);
        return schedule;
    }
    async register_schedule_service(schedule) {
        const jobName = `invoice-schedule-${schedule.id}`;
        this.remove_schedule_service(schedule.id);
        const job = new cron_1.CronJob(new Date(schedule.scheduled_at), async () => {
            await this.execute_schedule_service(schedule.id);
        });
        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();
    }
    async execute_schedule_service(scheduleId) {
        const query = `
      SELECT s.*, i.id as invoice_id, i.invoice_number 
      FROM invoice_schedules s
      LEFT JOIN invoices i ON s.invoice_id = i.id
      WHERE s.id = $1
    `;
        const schedules = await this.scheduleRepo.query(query, [scheduleId]);
        const schedule = schedules[0];
        if (!schedule)
            return;
        try {
            await this.scheduleRepo.query(`UPDATE invoice_schedules SET status = $1 WHERE id = $2`, [invoice_schedules_entity_1.ScheduleStatus.PROCESSING, scheduleId]);
            await this.scheduleRepo.query(`UPDATE invoice_schedules SET status = $1, sent_at = NOW() WHERE id = $2`, [invoice_schedules_entity_1.ScheduleStatus.SENT, scheduleId]);
            this.remove_schedule_service(scheduleId);
        }
        catch (error) {
            await this.handle_failed_schedule_service(scheduleId, error);
        }
    }
    async retry_schedule_service(scheduleId) {
        const result = await this.scheduleRepo.query(`UPDATE invoice_schedules SET status = $1 WHERE id = $2 RETURNING *`, [invoice_schedules_entity_1.ScheduleStatus.PENDING, scheduleId]);
        const schedule = result[0];
        if (!schedule)
            throw new common_1.BadRequestException("Schedule not found");
        await this.register_schedule_service(schedule);
        return schedule;
    }
    async single_schedule_service(scheduleId) {
        const result = await this.scheduleRepo.query(`SELECT s.*, i.invoice_number 
       FROM invoice_schedules s
       LEFT JOIN invoices i ON s.invoice_id = i.id
       WHERE s.id = $1`, [scheduleId]);
        return result[0] || null;
    }
    async load_pending_schedules_service() {
        const query = `SELECT * FROM invoice_schedules WHERE status = $1 AND scheduled_at > NOW()`;
        const schedules = await this.scheduleRepo.query(query, [
            invoice_schedules_entity_1.ScheduleStatus.PENDING,
        ]);
        for (const schedule of schedules) {
            await this.register_schedule_service(schedule);
        }
    }
    async handle_failed_schedule_service(scheduleId, error) {
        const query = `
      UPDATE invoice_schedules 
      SET attempts = attempts + 1, last_error = $1, status = $2 
      WHERE id = $3
    `;
        await this.scheduleRepo.query(query, [
            error?.message || "Unknown error",
            invoice_schedules_entity_1.ScheduleStatus.FAILED,
            scheduleId,
        ]);
    }
    async cancel_schedule_service(scheduleId) {
        const result = await this.scheduleRepo.query(`UPDATE invoice_schedules SET status = $1 WHERE id = $2 RETURNING id`, [invoice_schedules_entity_1.ScheduleStatus.CANCELLED, scheduleId]);
        if (result.length === 0)
            throw new common_1.BadRequestException("Schedule not found");
        this.remove_schedule_service(scheduleId);
        return { success: true };
    }
    remove_schedule_service(scheduleId) {
        const jobName = `invoice-schedule-${scheduleId}`;
        try {
            this.schedulerRegistry.deleteCronJob(jobName);
        }
        catch (e) { }
    }
    async all_schedules_service(userId) {
        return await this.scheduleRepo.query(`SELECT s.*, i.invoice_number 
       FROM invoice_schedules s 
       LEFT JOIN invoices i ON s.invoice_id = i.id 
       WHERE s.user_id = $1 
       ORDER BY s.scheduled_at ASC`, [userId]);
    }
};
exports.InvoiceSchedulesService = InvoiceSchedulesService;
exports.InvoiceSchedulesService = InvoiceSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(invoice_schedules_entity_1.InvoiceSchedule)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object, typeof (_b = typeof schedule_1.SchedulerRegistry !== "undefined" && schedule_1.SchedulerRegistry) === "function" ? _b : Object])
], InvoiceSchedulesService);
//# sourceMappingURL=invoice_schedules.service.js.map