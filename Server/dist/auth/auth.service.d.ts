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
        token: any;
        user: {
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
    update_user_service(user_id: any, data: any): Promise<any>;
    verify_email_service(user_id: any, email: any): Promise<any>;
    reset_user_password_service(user_id: any, new_password: any): Promise<any>;
    update_profile_image_service(user_id: string, newImage: string): Promise<{
        message: string;
        profile_image: string;
    }>;
}
