import { HttpStatus } from "@nestjs/common";
import { UserSessionsService } from "./user_sessions.service";
export declare class UserSessionsController {
    private readonly userSessionsService;
    constructor(userSessionsService: UserSessionsService);
    create_user_session_service(body: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./user_sessions.entity").UserSession;
    }>;
    get_all_sessions_service(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./user_sessions.entity").UserSession[];
    }>;
    get_user_sessions_service(userId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./user_sessions.entity").UserSession[];
    }>;
    update_user_session_service(uuid: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./user_sessions.entity").UserSession;
    }>;
    deactivate_user_session_service(uuid: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./user_sessions.entity").UserSession;
    }>;
}
