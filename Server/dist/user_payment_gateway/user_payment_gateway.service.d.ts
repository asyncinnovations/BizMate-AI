import { UserPaymentGatewayEntity } from "./user_payment_gateway.entity";
import { Repository } from "typeorm";
export declare class UserPaymentGatewayService {
    private readonly gatewayRepo;
    constructor(gatewayRepo: Repository<UserPaymentGatewayEntity>);
    connect_gateway_service(data: any): Promise<any>;
    all_gateway_service(): Promise<any>;
    user_gateway_service(user_id: string): Promise<any>;
    user_active_gateway_service(user_id: string, gateway_name: string): Promise<any>;
    deactivate_gateway_service(user_id: string, gateway_name: string): Promise<any>;
    single_gateway_service(id: string): Promise<any>;
    delete_user_gateway_service(user_id: string): Promise<any>;
}
