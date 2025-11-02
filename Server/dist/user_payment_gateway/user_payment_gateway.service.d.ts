import { UserPaymentGatewayEntity } from "./user_payment_gateway.entity";
import { Repository } from "typeorm";
export declare class UserPaymentGatewayService {
    private readonly gatewayRepo;
    constructor(gatewayRepo: Repository<UserPaymentGatewayEntity>);
    connect_gateway_service(data: any): Promise<UserPaymentGatewayEntity>;
    all_gateway_service(): Promise<UserPaymentGatewayEntity[]>;
    user_gateway_service(user_id: string): Promise<UserPaymentGatewayEntity[]>;
    user_active_gateway_service(user_id: string, gateway_name: string): Promise<UserPaymentGatewayEntity>;
    deactivate_gateway_service(user_id: string, gateway_name: string): Promise<UserPaymentGatewayEntity>;
    single_gateway_service(id: string): Promise<UserPaymentGatewayEntity[]>;
    delete_user_gateway_service(user_id: string): Promise<import("typeorm").DeleteResult>;
}
