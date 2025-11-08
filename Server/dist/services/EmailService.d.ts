export declare class EmailService {
    transporter: any;
    send_email_reminder(reminder: any): Promise<{
        success: boolean;
        response: any;
    } | undefined>;
    send_email(data: any): Promise<{
        success: boolean;
        response: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        response?: undefined;
    }>;
}
