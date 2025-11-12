export declare class AiReplyHubChat {
    id: number;
    uuid: string;
    user_id: string;
    client_id: string;
    platform: "whatsapp" | "email" | "instagram";
    direction: "inbound" | "outbound";
    message: string;
    ai_reply: string | null;
    ai_reply_enable: boolean;
    ai_model: string | null;
    sent_at: Date;
    received_at: Date | null;
    status: "sent" | "delivered" | "read" | "failed";
    error_message: string | null;
}
