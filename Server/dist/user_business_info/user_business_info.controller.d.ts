import { UserBusinessInfoService } from "./user_business_info.service";
export declare class UserBusinessInfoController {
    private readonly UserBusiness;
    constructor(UserBusiness: UserBusinessInfoService);
    create_business_info(data: any): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo;
    }>;
    single_business_info(id: string): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo;
    }>;
    user_business_info(user_id: string): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo[];
    }>;
    update_business_info(id: string, data: any): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo;
    }>;
    delete_business_info(id: string): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo | import("typeorm").DeleteResult;
    }>;
    search_business_info(user_id: string, query: string): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo[];
    }>;
    bulk_insert_business_info(data: any[]): Promise<{
        message: string;
        response: import("./user_business_info.entity").UserBusinessInfo[];
    }>;
}
