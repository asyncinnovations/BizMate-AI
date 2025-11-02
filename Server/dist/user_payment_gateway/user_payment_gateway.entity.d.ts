export declare class UserPaymentGatewayEntity {
    id: number;
    uuid: string;
    user_id: string;
    gateway_name: string;
    credentials: Record<string, any>;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
