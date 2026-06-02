import { AiReminderService } from "./ai_reminder.service";
export declare class AiReminderController {
    private readonly reminderService;
    constructor(reminderService: AiReminderService);
    create_reminder(body: any): Promise<{
        message: string;
        response: any;
    }>;
    all_reminders(req: any, status?: string, type?: string, from?: string, to?: string): Promise<{
        message: string;
        response: any;
    }>;
    user_reminder(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    single_reminder(uuid: string): Promise<{
        message: string;
        response: any;
    }>;
    update_reminder(reminder_id: string, body: any): Promise<{
        message: string;
        response: any;
    }>;
    update_reminder_status(reminder_id: string, status: "pending" | "sent" | "completed" | "missed"): Promise<{
        message: string;
        response: any;
    }>;
    upcoming_reminders(daysAhead?: number): Promise<{
        message: string;
        response: any;
    }>;
    recurring_reminders(user_id: any): Promise<{
        message: string;
        response: any;
    }>;
    create_ai_generated(req: any, body: any): Promise<{
        message: string;
        response: any;
    }>;
    delete_reminder(uuid: string): Promise<{
        message: string;
        response: any;
    }>;
}
