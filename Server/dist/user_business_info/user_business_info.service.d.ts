import { Repository } from "typeorm";
import { UserBusinessInfo } from "./user_business_info.entity";
export declare class UserBusinessInfoService {
    private readonly userBusiness;
    constructor(userBusiness: Repository<UserBusinessInfo>);
    create_business_info_serivce(data: Partial<UserBusinessInfo>): Promise<any>;
    single_business_info_service(idOrUuid: string | number): Promise<any>;
    user_business_info_service(user_id: string): Promise<any>;
    update_business_info_service(idOrUuid: string | number, data: Partial<UserBusinessInfo>): Promise<any>;
    delete_business_info_service(idOrUuid: string | number, soft?: boolean): Promise<any>;
    search_business_info_service(user_id: string, query: string): Promise<any>;
    bulk_insert_business_info_service(entries: Partial<UserBusinessInfo>[]): Promise<any>;
}
