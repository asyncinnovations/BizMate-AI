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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
let SchedulingService = class SchedulingService {
    schedulerRegistry;
    constructor(schedulerRegistry) {
        this.schedulerRegistry = schedulerRegistry;
    }
    async create_daily_reminder_service(invoiceId, hour = 9, minute = 0) {
        const jobName = `daily-${invoiceId}`;
        const cronExpression = `${minute} ${hour} * * *`;
        const job = new cron_1.CronJob(cronExpression, async () => {
            console.log(`Daily reminder: ${invoiceId}`);
        }, null, true, "Asia/Dhaka");
        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();
        return {
            success: true,
            message: "Daily reminder created",
        };
    }
    async create_weekly_reminder_service(invoiceId, dayOfWeek, hour = 9, minute = 0) {
        const jobName = `weekly-${invoiceId}`;
        const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;
        const job = new cron_1.CronJob(cronExpression, async () => {
            console.log(`Weekly reminder: ${invoiceId}`);
        }, null, true, "Asia/Dhaka");
        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();
        return {
            success: true,
            message: "Weekly reminder created",
        };
    }
    async create_monthly_reminder_service(invoiceId, dayOfMonth, hour = 9, minute = 0) {
        const jobName = `monthly-${invoiceId}`;
        const cronExpression = `${minute} ${hour} ${dayOfMonth} * *`;
        const job = new cron_1.CronJob(cronExpression, async () => {
            console.log(`Monthly reminder: ${invoiceId}`);
        }, null, true, "Asia/Dhaka");
        this.schedulerRegistry.addCronJob(jobName, job);
        job.start();
        return {
            success: true,
            message: "Monthly reminder created",
        };
    }
    async delete_reminder_service(jobName) {
        this.schedulerRegistry.deleteCronJob(jobName);
        return {
            success: true,
        };
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof schedule_1.SchedulerRegistry !== "undefined" && schedule_1.SchedulerRegistry) === "function" ? _a : Object])
], SchedulingService);
//# sourceMappingURL=invoice-scheduler.js.map