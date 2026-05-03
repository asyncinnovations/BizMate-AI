import { AuthService } from "./auth.service";
import { UserRole } from "./user.entity";
import { SubscriptionPlanService } from "src/subscription_plans/subscription_plans.service";
export declare class AuthController {
    private authService;
    private planService;
    constructor(authService: AuthService, planService: SubscriptionPlanService);
    private validateSignup;
    private validateLogin;
    signup(data: any, file?: Express.Multer.File): Promise<{
        message: string;
        response: {
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
    login(body: {
        email: string;
        password: string;
    }): Promise<{
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
            role: UserRole;
            language: string;
            status: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    all_users(): Promise<{
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
    single_user(user_id: string): Promise<{
        message: string;
        response: {
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
            role: UserRole | undefined;
            language: string | undefined;
            status: string | undefined;
            created_at: Date | undefined;
            updated_at: Date | undefined;
        };
    }>;
    update_user(user_id: any, body: any): Promise<{
        message: string;
        response: import("typeorm").UpdateResult;
    }>;
    update_profile_image(user_id: any, body: any, file?: Express.Multer.File): Promise<{
        message: string;
        response: {
            message: string;
            profile_image: string;
        };
    }>;
    verify_email(user_id: any, body: any): Promise<{
        message: string;
        response: any;
    }>;
    reset_user_password(user_id: any, body: any): Promise<{
        message: string;
        response: import("typeorm").UpdateResult;
    }>;
}
