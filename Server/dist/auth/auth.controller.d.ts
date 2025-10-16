import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(body: {
        email: string;
        password: string;
        full_name: string;
        phone: any;
        company_name: string;
        license_number: any;
        vat_id: any;
        idustry: any;
        role: any;
    }): Promise<{
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            email: string;
            full_name: string;
            role: import("./user.entity").UserRole;
            phone: string;
            language: string;
            user_id: string;
        };
    }>;
    all_users(): Promise<any>;
}
