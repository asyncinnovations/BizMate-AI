import { Repository } from "typeorm";
import { NotificationPreference } from "./notification_preferences.entity";
export declare class NotificationPreferencesService {
    private readonly preferenceRepository;
    constructor(preferenceRepository: Repository<NotificationPreference>);
    create_preference_service(data: {
        user_id: string;
        company_id?: string;
        event_type: string;
        email_enabled?: boolean;
        sms_enabled?: boolean;
        push_enabled?: boolean;
        dashboard_enabled?: boolean;
    }): Promise<any>;
    update_preference_service(preference_id: string, updates: Partial<NotificationPreference>): Promise<any>;
    single_preference_service(preference_id: string): Promise<any>;
    user_preference_service(user_id: string, company_id?: string): Promise<any>;
    delete_preference_service(preference_id: string): Promise<{
        message: string;
    }>;
    toggle_channel_service(preference_id: string, channel: "email" | "sms" | "push" | "dashboard", enabled: boolean): Promise<any>;
}
