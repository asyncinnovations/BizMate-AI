import { Repository } from "typeorm";
import { AiReminder } from "./ai_reminder.entity";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";
export declare class AiReminderService {
    private readonly aiReminderRepo;
    private readonly gptService;
    private readonly promptService;
    constructor(aiReminderRepo: Repository<AiReminder>, gptService: GPTService, promptService: PromptService);
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
    ai_generate_from_prompt_service(user_id: string, prompt: string): Promise<{
        message: string;
        ai_result: {
            type: any;
            title: any;
            description: any;
            reminder_date: any;
            notify_before: number;
            recurrence_rule: any;
            notify_channels: any;
            ai_prompt: string;
            source: string;
        };
        user_id: string;
    }>;
    get_module_suggestions_service(user_id: string): Promise<{
        message: string;
        suggestions: any[];
        total: number;
    }>;
    create_from_module_service(data: {
        user_id: string;
        type: string;
        source: string;
        reference_id: string;
        reference_type: string;
        title: string;
        description?: string;
        reminder_date: string;
        notify_before?: number;
        notify_channels?: {
            email: boolean;
            whatsapp: boolean;
            push: boolean;
        };
        recurrence_rule?: string;
    }): Promise<{
        message: string;
        reminder: AiReminder;
        duplicate: boolean;
    }>;
}
