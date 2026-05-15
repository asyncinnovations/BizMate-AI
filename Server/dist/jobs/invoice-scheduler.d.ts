import { SchedulerRegistry } from "@nestjs/schedule";
export declare class SchedulingService {
    private readonly schedulerRegistry;
    constructor(schedulerRegistry: SchedulerRegistry);
    create_daily_reminder_service(invoiceId: string, hour?: number, minute?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    create_weekly_reminder_service(invoiceId: string, dayOfWeek: number, hour?: number, minute?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    create_monthly_reminder_service(invoiceId: string, dayOfMonth: number, hour?: number, minute?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    delete_reminder_service(jobName: string): Promise<{
        success: boolean;
    }>;
}
