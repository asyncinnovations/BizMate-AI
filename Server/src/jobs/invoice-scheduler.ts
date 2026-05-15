import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";

@Injectable()
export class SchedulingService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  // ==============================
  // DAILY REMINDER SERVICE
  // ==============================

  async create_daily_reminder_service(
    invoiceId: string,
    hour: number = 9,
    minute: number = 0,
  ) {
    const jobName = `daily-${invoiceId}`;

    const cronExpression = `${minute} ${hour} * * *`;

    const job = new CronJob(
      cronExpression,
      async () => {
        console.log(`Daily reminder: ${invoiceId}`);

        // send notification
        // send email
        // whatsapp
      },
      null,
      true,
      "Asia/Dhaka",
    );

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();

    return {
      success: true,
      message: "Daily reminder created",
    };
  }

  // ==============================
  // WEEKLY REMINDER SERVICE
  // ==============================

  async create_weekly_reminder_service(
    invoiceId: string,
    dayOfWeek: number,
    hour: number = 9,
    minute: number = 0,
  ) {
    /**
     * dayOfWeek
     * 0 = Sunday
     * 1 = Monday
     * 2 = Tuesday
     */

    const jobName = `weekly-${invoiceId}`;

    const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;

    const job = new CronJob(
      cronExpression,
      async () => {
        console.log(`Weekly reminder: ${invoiceId}`);

        // email
        // push
      },
      null,
      true,
      "Asia/Dhaka",
    );

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();

    return {
      success: true,
      message: "Weekly reminder created",
    };
  }

  // ====================================
  // MONTHLY REMINDER SERVICE
  // ====================================

  async create_monthly_reminder_service(
    invoiceId: string,
    dayOfMonth: number,
    hour: number = 9,
    minute: number = 0,
  ) {
    /**
     * dayOfMonth:
     * 1–31
     */

    const jobName = `monthly-${invoiceId}`;

    const cronExpression = `${minute} ${hour} ${dayOfMonth} * *`;

    const job = new CronJob(
      cronExpression,
      async () => {
        console.log(`Monthly reminder: ${invoiceId}`);

        // email
        // push notification
      },
      null,
      true,
      "Asia/Dhaka",
    );

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();

    return {
      success: true,
      message: "Monthly reminder created",
    };
  }

  // ========================
  // DELETE REMINDER
  // ========================

  async delete_reminder_service(jobName: string) {
    this.schedulerRegistry.deleteCronJob(jobName);

    return {
      success: true,
    };
  }
}
// Usage after invoice creation:
// await this.schedulingService.create_daily_reminder_service(invoice.id, 8, 30);

// await this.schedulingService.create_weekly_reminder_service(
//   invoice.id,
//   5, // Friday
//   10,
//   0,
// );

// await this.schedulingService.create_monthly_reminder_service(
//   invoice.id,
//   15,
//   9,
//   0,
// );
// * * * * *
// | | | | |
// | | | | └── Day of week
// | | | └──── Month
// | | └────── Day
// | └──────── Hour
// └────────── Minute
