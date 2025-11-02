export declare class EmailService {
    send_email(data: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
