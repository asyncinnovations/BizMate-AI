import { NotificationPreferencesService } from "./notification_preferences.service";
export declare class NotificationPreferencesController {
    private readonly preferencesService;
    constructor(preferencesService: NotificationPreferencesService);
    createPreference(body: any): Promise<import("./notification_preferences.entity").NotificationPreference>;
    updatePreference(preference_id: string, updates: any): Promise<import("./notification_preferences.entity").NotificationPreference[]>;
    getPreferenceById(preference_id: string): Promise<import("./notification_preferences.entity").NotificationPreference>;
    getPreferencesByUser(user_id: string, company_id?: string): Promise<import("./notification_preferences.entity").NotificationPreference[]>;
    deletePreference(preference_id: string): Promise<{
        message: string;
    }>;
    toggleChannel(preference_id: string, body: {
        channel: "email" | "sms" | "push" | "dashboard";
        enabled: boolean;
    }): Promise<import("./notification_preferences.entity").NotificationPreference>;
}
