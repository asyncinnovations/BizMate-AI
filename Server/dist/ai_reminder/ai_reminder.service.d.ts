import { Repository } from "typeorm";
import { AiReminder } from "./ai_reminder.entity";
export declare class AiReminderService {
    private readonly aiReminderRepo;
    constructor(aiReminderRepo: Repository<AiReminder>);
    create_reminder_service(data: Partial<AiReminder>): Promise<AiReminder>;
    all_reminders_service(user_id?: string, filters?: any): Promise<AiReminder[]>;
    single_reminder_service(uuid: string): Promise<AiReminder>;
    user_reminder_service(user_id: string): Promise<any>;
    update_reminder_service(uuid: string, data: Partial<AiReminder>): Promise<AiReminder>;
    delete_reminder_service(uuid: string): Promise<AiReminder>;
    update_reminder_status_service(uuid: string, status: AiReminder["status"]): Promise<AiReminder>;
    recurring_reminder_servcie(user_id: string): Promise<AiReminder[]>;
    upcoming_reminder_service(daysAhead?: number): Promise<AiReminder[]>;
    create_bulk_reminders_service(reminders: Partial<AiReminder>[]): Promise<AiReminder[]>;
    generate_ai_reminder_service(data: Partial<AiReminder>): Promise<AiReminder>;
}
