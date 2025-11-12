import { Repository } from "typeorm";
import { UserBusinessInfo } from "./user_business_info.entity";
export declare class UserBusinessInfoService {
    private readonly userBusiness;
    constructor(userBusiness: Repository<UserBusinessInfo>);
    create_business_info_serivce(data: Partial<UserBusinessInfo>): Promise<UserBusinessInfo>;
    single_business_info_service(idOrUuid: string | number): Promise<UserBusinessInfo>;
    user_business_info_service(user_id: string): Promise<UserBusinessInfo[]>;
    update_business_info_service(idOrUuid: string | number, data: Partial<UserBusinessInfo>): Promise<UserBusinessInfo>;
    delete_business_info_service(idOrUuid: string | number, soft?: boolean): Promise<UserBusinessInfo | import("typeorm").DeleteResult>;
    search_business_info_service(user_id: string, query: string): Promise<UserBusinessInfo[]>;
    bulk_insert_business_info_service(entries: Partial<UserBusinessInfo>[]): Promise<UserBusinessInfo[]>;
}
