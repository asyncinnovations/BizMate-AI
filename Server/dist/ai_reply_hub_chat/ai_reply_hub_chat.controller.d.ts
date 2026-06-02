import { AiReplyHubChatService } from "./ai_reply_hub_chat.service";
export declare class AiReplyHubChatController {
    private readonly aireplyHub;
    constructor(aireplyHub: AiReplyHubChatService);
    create_message(body: any): Promise<{
        message: string;
        result: any;
    }>;
    get_single_message(id: string): Promise<{
        message: string;
        result: any;
    }>;
    get_all_messages(user_id: string, client_id?: string, platform?: string, direction?: string): Promise<{
        message: string;
        result: any;
    }>;
    update_message(id: string, body: any): Promise<{
        message: string;
        result: any;
    }>;
    delete_message(id: string): Promise<{
        message: string;
        result: any;
    }>;
    toggle_ai_reply(id: string, enable: boolean): Promise<{
        message: string;
        result: any;
    }>;
    search_messages(user_id: string, query: string): Promise<{
        message: string;
        result: any;
    }>;
    get_unanswered_ai_messages(user_id: string): Promise<{
        message: string;
        result: any;
    }>;
    bulk_insert_messages(body: any[]): Promise<{
        message: string;
        result: any;
    }>;
    update_status(id: string, body: {
        status: "sent" | "delivered" | "read" | "failed";
        error_message?: string;
    }): Promise<{
        message: string;
        result: any;
    }>;
    update_ai_reply(id: string, body: {
        ai_reply: string;
        model?: string;
    }): Promise<{
        message: string;
        result: any;
    }>;
    generate_ai_reply(id: string): Promise<{
        message: string;
        result: any;
    }>;
    chat_history(user_id: string, client_id: string): Promise<{
        message: string;
        result: any;
    }>;
    user_message_partner(user_id: string): Promise<{
        message: string;
        result: any;
    }>;
    chat_mark_as_read_service(message_id: string): Promise<{
        message: string;
        result: any;
    }>;
    chat_mark_as_all_read_service(client_id: string): Promise<{
        message: string;
        result: any;
    }>;
}
