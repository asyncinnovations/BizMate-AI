export declare class UserTwoFactorSettings {
    id: number;
    uuid: string;
    user_id: string;
    is_enabled: boolean;
    method: "totp" | "sms" | "email";
    secret: string | null;
    phone: string | null;
    email: string | null;
    created_at: Date;
    updated_at: Date;
}
