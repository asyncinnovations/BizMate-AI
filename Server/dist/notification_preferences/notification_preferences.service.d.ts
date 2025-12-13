import { Repository } from "typeorm";
import { NotificationPreference } from "./notification_preferences.entity";
export declare class NotificationPreferencesService {
    private readonly preferenceRepository;
    constructor(preferenceRepository: Repository<NotificationPreference>);
    createPreference(data: {
        user_id: string;
        company_id?: string;
        event_type: string;
        email_enabled?: boolean;
        sms_enabled?: boolean;
        push_enabled?: boolean;
        dashboard_enabled?: boolean;
    }): Promise<NotificationPreference>;
    updatePreference(preference_id: string, updates: Partial<NotificationPreference>): Promise<NotificationPreference[]>;
    getPreferenceById(preference_id: string): Promise<NotificationPreference>;
    getPreferencesByUser(user_id: string, company_id?: string): Promise<NotificationPreference[]>;
    deletePreference(preference_id: string): Promise<{
        message: string;
    }>;
    toggleChannel(preference_id: string, channel: "email" | "sms" | "push" | "dashboard", enabled: boolean): Promise<NotificationPreference>;
}
