import { UserSessionsService } from "./user_sessions.service";
export declare class UserSessionsController {
    private readonly userSessionsService;
    constructor(userSessionsService: UserSessionsService);
    create_user_session_service(body: any): Promise<{
        statusCode: any;
        message: string;
        data: any;
    }>;
    get_all_sessions_service(): Promise<{
        statusCode: any;
        message: string;
        data: any;
    }>;
    get_user_sessions_service(userId: string): Promise<{
        statusCode: any;
        message: string;
        data: any;
    }>;
    update_user_session_service(uuid: string): Promise<{
        statusCode: any;
        message: string;
        data: any;
    }>;
    deactivate_user_session_service(uuid: string): Promise<{
        statusCode: any;
        message: string;
        data: any;
    }>;
}
