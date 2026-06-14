import { BadRequestException } from "@nestjs/common";
import { UserIntegrationService } from "./user_integration.service";
export declare class UserIntegrationController {
    private readonly Integrationservice;
    constructor(Integrationservice: UserIntegrationService);
    create_userIntegration(body: any): Promise<BadRequestException | {
        message: string;
        response: import("./user_integration.entity").UserIntegration[];
    }>;
    all_userIntegration(): Promise<{
        message: string;
        response: import("./user_integration.entity").UserIntegration[];
    }>;
    single_userIntegration(id: string): Promise<{
        message: string;
        response: import("./user_integration.entity").UserIntegration;
    }>;
    user_userIntegration(user_id: string): Promise<{
        message: string;
        response: import("./user_integration.entity").UserIntegration[];
    }>;
    update_userIntegration(id: string, body: any): Promise<{
        message: string;
        response: import("./user_integration.entity").UserIntegration | null;
    }>;
    delete_userIntegration(id: string): Promise<{
        message: string;
        response: import("typeorm").DeleteResult;
    }>;
    change_userIntegration_status(id: string, status: "connected" | "disconnected"): Promise<{
        message: string;
        response: import("./user_integration.entity").UserIntegration;
    }>;
    update_userIntegration_lastSync(id: string): Promise<{
        message: string;
        response: import("./user_integration.entity").UserIntegration;
    }>;
}
