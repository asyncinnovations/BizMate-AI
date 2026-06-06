import { AiReminderService } from "./ai_reminder.service";
import { AiReminder } from "./ai_reminder.entity";
export declare class AiReminderController {
    private readonly reminderService;
    constructor(reminderService: AiReminderService);
    create_reminder(body: any): Promise<{
        message: string;
        response: AiReminder;
    }>;
    all_reminders(req: any, status?: string, type?: string, from?: string, to?: string): Promise<{
        message: string;
        response: AiReminder[];
    }>;
    user_reminder(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    single_reminder(uuid: string): Promise<{
        message: string;
        response: AiReminder;
    }>;
    update_reminder(reminder_id: string, body: any): Promise<{
        message: string;
        response: AiReminder;
    }>;
    update_reminder_status(reminder_id: string, status: "pending" | "sent" | "completed" | "missed"): Promise<{
        message: string;
        response: AiReminder;
    }>;
    upcoming_reminders(daysAhead?: number): Promise<{
        message: string;
        response: AiReminder[];
    }>;
    recurring_reminders(user_id: any): Promise<{
        message: string;
        response: AiReminder[];
    }>;
    create_ai_generated(req: any, body: any): Promise<{
        message: string;
        response: AiReminder;
    }>;
    delete_reminder(uuid: string): Promise<{
        message: string;
        response: AiReminder;
    }>;
    ai_generate_from_prompt(user_id: string, prompt: string): Promise<{
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
    get_module_suggestions(user_id: string): Promise<{
        message: string;
        suggestions: any[];
        total: number;
    }>;
    create_from_module(body: any): Promise<{
        message: string;
        reminder: AiReminder;
        duplicate: boolean;
    }>;
}
