import { UserIntegration } from "./user_integration.entity";
import { Repository } from "typeorm";
export declare class UserIntegrationService {
    private readonly userIntegration;
    constructor(userIntegration: Repository<UserIntegration>);
    create_userIntegration_service(data: any): Promise<UserIntegration[]>;
    all_userIntegration_service(): Promise<UserIntegration[]>;
    single_userIntegration_service(uuid: string): Promise<UserIntegration>;
    user_userIntegration_service(user_id: string): Promise<UserIntegration[]>;
    update_userIntegration_service(uuid: string, data: any): Promise<UserIntegration | null>;
    delete_userIntegration_service(uuid: string): Promise<import("typeorm").DeleteResult>;
    update_lastsync_userIntegration_service(uuid: string): Promise<UserIntegration>;
    change_status_userIntegration_service(uuid: string, status: "connected" | "disconnected"): Promise<UserIntegration>;
}
