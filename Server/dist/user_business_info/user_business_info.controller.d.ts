import { UserBusinessInfoService } from "./user_business_info.service";
export declare class UserBusinessInfoController {
    private readonly UserBusiness;
    constructor(UserBusiness: UserBusinessInfoService);
    create_business_info(data: any): Promise<{
        message: string;
        response: any;
    }>;
    single_business_info(id: string): Promise<{
        message: string;
        response: any;
    }>;
    user_business_info(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    update_business_info(id: string, data: any): Promise<{
        message: string;
        response: any;
    }>;
    delete_business_info(id: string): Promise<{
        message: string;
        response: any;
    }>;
    search_business_info(user_id: string, query: string): Promise<{
        message: string;
        response: any;
    }>;
    bulk_insert_business_info(data: any[]): Promise<{
        message: string;
        response: any;
    }>;
}
