import { Repository } from "typeorm";
import { AiReminder } from "./ai_reminder.entity";
export declare class AiReminderService {
    private readonly aiReminderRepo;
    constructor(aiReminderRepo: Repository<AiReminder>);
    create_reminder_service(data: Partial<AiReminder>): Promise<any>;
    all_reminders_service(user_id?: string, filters?: any): Promise<any>;
    single_reminder_service(uuid: string): Promise<any>;
    user_reminder_service(user_id: string): Promise<any>;
    update_reminder_service(uuid: string, data: Partial<AiReminder>): Promise<any>;
    delete_reminder_service(uuid: string): Promise<any>;
    update_reminder_status_service(uuid: string, status: AiReminder["status"]): Promise<any>;
    recurring_reminder_servcie(user_id: string): Promise<any>;
    upcoming_reminder_service(daysAhead?: number): Promise<any>;
    create_bulk_reminders_service(reminders: Partial<AiReminder>[]): Promise<any>;
    generate_ai_reminder_service(data: Partial<AiReminder>): Promise<any>;
}
