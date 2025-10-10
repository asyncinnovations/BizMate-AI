import { JwtService } from "@nestjs/jwt";
import { AuthUsers } from "./user.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private usersRepo;
    private jwtService;
    constructor(usersRepo: Repository<AuthUsers>, jwtService: JwtService);
    signup(email: string, password: string, full_name: string, phone: any, role: any): Promise<{
        message: string;
    }>;
    login(email: string, password: string): Promise<{
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
