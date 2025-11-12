export declare class WhatsappService {
    send_whatsapp_reminder(reminder: any, user_phone: any): Promise<{
        success: boolean;
        response: any;
    } | undefined>;
}
