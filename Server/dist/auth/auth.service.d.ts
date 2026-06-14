import { JwtService } from "@nestjs/jwt";
import { AuthUsers } from "./user.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: Repository<AuthUsers>, jwtService: JwtService);
    signup_service(data: any): Promise<{
        user_id: any;
        id: any;
        full_name: any;
        email: any;
        phone: any;
        lichence_file: any;
        company_name: any;
        license_number: any;
        vat_id: any;
        industry: any;
        role: any;
        language: any;
        status: any;
        created_at: any;
        updated_at: any;
    }>;
    login_service(email: string, password: string): Promise<{
        token: string;
        user: {
            user_id: string;
            id: number;
            full_name: string;
            email: string;
            phone: string;
            lichence_file: string;
            company_name: string;
            license_number: string;
            vat_id: string;
            industry: string;
            role: import("./user.entity").UserRole;
            language: string;
            status: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    all_users_service(): Promise<{
        user_id: any;
        id: any;
        full_name: any;
        email: any;
        phone: any;
        lichence_file: any;
        company_name: any;
        license_number: any;
        vat_id: any;
        industry: any;
        role: any;
        language: any;
        status: any;
        created_at: any;
        updated_at: any;
    }>;
    single_user_service(user_id: string): Promise<{
        user_id: string | undefined;
        id: number | undefined;
        full_name: string | undefined;
        email: string | undefined;
        phone: string | undefined;
        lichence_file: string | undefined;
        company_name: string | undefined;
        license_number: string | undefined;
        vat_id: string | undefined;
        industry: string | undefined;
        role: import("./user.entity").UserRole | undefined;
        language: string | undefined;
        status: string | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }>;
    update_user_service(user_id: any, data: any): Promise<import("typeorm").UpdateResult>;
    verify_email_service(user_id: any, email: any): Promise<any>;
    reset_user_password_service(user_id: any, new_password: any): Promise<import("typeorm").UpdateResult>;
    update_profile_image_service(user_id: string, newImage: string): Promise<{
        message: string;
        profile_image: string;
    }>;
}
