import { UserIntegrationService } from "./user_integration.service";
export declare class UserIntegrationController {
    private readonly Integrationservice;
    constructor(Integrationservice: UserIntegrationService);
    create_userIntegration(body: any): Promise<any>;
    all_userIntegration(): Promise<{
        message: string;
        response: any;
    }>;
    single_userIntegration(id: string): Promise<{
        message: string;
        response: any;
    }>;
    user_userIntegration(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    update_userIntegration(id: string, body: any): Promise<{
        message: string;
        response: any;
    }>;
    delete_userIntegration(id: string): Promise<{
        message: string;
        response: any;
    }>;
    change_userIntegration_status(id: string, status: "connected" | "disconnected"): Promise<{
        message: string;
        response: any;
    }>;
    update_userIntegration_lastSync(id: string): Promise<{
        message: string;
        response: any;
    }>;
}
