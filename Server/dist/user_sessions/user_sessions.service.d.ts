import { Repository } from "typeorm";
import { UserSession } from "./user_sessions.entity";
import { AuthUsers } from "src/auth/user.entity";
export declare class UserSessionsService {
    private readonly userSessionRepo;
    private readonly userRepo;
    constructor(userSessionRepo: Repository<UserSession>, userRepo: Repository<AuthUsers>);
    create_user_session_service(createDto: any): Promise<UserSession>;
    get_all_sessions_service(): Promise<UserSession[]>;
    get_user_sessions_service(userId: string): Promise<UserSession[]>;
    update_user_session_service(uuid: string): Promise<UserSession>;
    deactivate_user_session_service(uuid: string): Promise<UserSession>;
}
