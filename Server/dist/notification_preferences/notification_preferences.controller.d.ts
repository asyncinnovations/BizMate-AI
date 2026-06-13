import { NotificationPreferencesService } from "./notification_preferences.service";
export declare class NotificationPreferencesController {
    private readonly preferencesService;
    constructor(preferencesService: NotificationPreferencesService);
    create_preference(body: any): Promise<{
        message: string;
        response: any;
    }>;
    update_preference(preference_id: string, updates: any): Promise<{
        message: string;
        response: any;
    }>;
    single_preference(preference_id: string): Promise<{
        message: string;
        response: any;
    }>;
    user_preference(user_id: string, company_id?: string): Promise<{
        message: string;
        response: any;
    }>;
    toggle_channel(preference_id: string, body: {
        channel: "email" | "sms" | "push" | "dashboard";
        enabled: boolean;
    }): Promise<{
        message: string;
        response: any;
    }>;
    delete_preference(preference_id: string): Promise<{
        message: string;
        response: {
            message: string;
        };
    }>;
}
