export declare class UserIntegration {
    uuid: string;
    id: number;
    user_id: string;
    platform: "email" | "whatsapp" | "instagram";
    access_token: string;
    refresh_token: string;
    expires_at: Date;
    last_sync_at: Date;
    status: "connected" | "disconnected";
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
