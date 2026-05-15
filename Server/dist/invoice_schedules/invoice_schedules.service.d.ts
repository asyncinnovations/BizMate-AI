import { OnModuleInit } from "@nestjs/common";
import { Repository } from "typeorm";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InvoiceSchedule } from "./invoice_schedules.entity";
export declare class InvoiceSchedulesService implements OnModuleInit {
    private readonly scheduleRepo;
    private readonly schedulerRegistry;
    constructor(scheduleRepo: Repository<InvoiceSchedule>, schedulerRegistry: SchedulerRegistry);
    onModuleInit(): Promise<void>;
    create_schedule_service(dto: any): Promise<any>;
    register_schedule_service(schedule: any): Promise<void>;
    execute_schedule_service(scheduleId: string): Promise<void>;
    retry_schedule_service(scheduleId: string): Promise<any>;
    single_schedule_service(scheduleId: string): Promise<any>;
    load_pending_schedules_service(): Promise<void>;
    handle_failed_schedule_service(scheduleId: string, error: any): Promise<void>;
    cancel_schedule_service(scheduleId: string): Promise<{
        success: boolean;
    }>;
    remove_schedule_service(scheduleId: string): void;
    all_schedules_service(userId: string): Promise<any>;
}
