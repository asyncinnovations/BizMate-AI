import { UserPaymentGatewayService } from "./user_payment_gateway.service";
import { PaymentService } from "src/common/PaymentService";
export declare class UserPaymentGatewayController {
    private readonly gatewayService;
    private readonly paymentService;
    constructor(gatewayService: UserPaymentGatewayService, paymentService: PaymentService);
    validate(data: any): {
        valid: boolean;
        errors?: any;
    };
    connect_gateway(body: any): Promise<{
        message: string;
        response: import("./user_payment_gateway.entity").UserPaymentGatewayEntity;
    }>;
    all_gateway(): Promise<{
        message: string;
        response: import("./user_payment_gateway.entity").UserPaymentGatewayEntity[];
    }>;
    single_gateway(id: string): Promise<{
        message: string;
        response: import("./user_payment_gateway.entity").UserPaymentGatewayEntity[];
    }>;
    user_gateways(user_id: string): Promise<{
        message: string;
        response: import("./user_payment_gateway.entity").UserPaymentGatewayEntity[];
    }>;
    user_active_gateway(user_id: string, gateway_name: string): Promise<{
        message: string;
        response: import("./user_payment_gateway.entity").UserPaymentGatewayEntity;
    }>;
    deactivate_gateway(user_id: string, gateway_name: string): Promise<{
        message: string;
        response: import("./user_payment_gateway.entity").UserPaymentGatewayEntity;
    }>;
    delete_user_gateway(user_id: string): Promise<{
        message: string;
        response: import("typeorm").DeleteResult;
    }>;
    payment_link(body: {
        user_id: string;
        amount: number;
        gateway_name: string;
    }): Promise<any>;
}
