import { UserIntegration } from "./user_integration.entity";
import { Repository } from "typeorm";
export declare class UserIntegrationService {
    private readonly userIntegration;
    constructor(userIntegration: Repository<UserIntegration>);
    create_userIntegration_service(data: any): Promise<any>;
    all_userIntegration_service(): Promise<any>;
    single_userIntegration_service(uuid: string): Promise<any>;
    user_userIntegration_service(user_id: string): Promise<any>;
    update_userIntegration_service(uuid: string, data: any): Promise<any>;
    delete_userIntegration_service(uuid: string): Promise<any>;
    update_lastsync_userIntegration_service(uuid: string): Promise<any>;
    change_status_userIntegration_service(uuid: string, status: "connected" | "disconnected"): Promise<any>;
}
