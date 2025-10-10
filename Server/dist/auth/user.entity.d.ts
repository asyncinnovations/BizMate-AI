export declare enum UserRole {
    ADMIN = "admin",
    BUSINESS_OWNER = "business_owner",
    TEAM_MEMBER = "team_member"
}
export declare class AuthUsers {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    phone: string;
    password_hash: string;
    role: UserRole;
    language_preference: string;
    created_at: Date;
    updated_at: Date;
}
