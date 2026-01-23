export declare enum UserRole {
    ADMIN = "admin",
    BUSINESS_OWNER = "business_owner",
    TEAM_MEMBER = "team_member"
}
export declare class AuthUsers {
    uuid: string;
    id: number;
    full_name: string;
    email: string;
    phone: string;
    password_hash: string;
    lichence_file: string;
    profile_image: string;
    company_name: string;
    license_number: string;
    vat_id: string;
    email_verified: boolean;
    phone_verified: boolean;
    industry: string;
    role: UserRole;
    language_preference: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
