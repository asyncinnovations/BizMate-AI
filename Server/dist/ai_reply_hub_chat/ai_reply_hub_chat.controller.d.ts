import { AiReplyHubChatService } from "./ai_reply_hub_chat.service";
export declare class AiReplyHubChatController {
    private readonly aireplyHub;
    constructor(aireplyHub: AiReplyHubChatService);
    create_message(body: any): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat;
    }>;
    get_single_message(id: string): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat;
    }>;
    get_all_messages(user_id: string, client_id?: string, platform?: string, direction?: string): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat[];
    }>;
    update_message(id: string, body: any): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat;
    }>;
    delete_message(id: string): Promise<{
        message: string;
        result: import("typeorm").DeleteResult;
    }>;
    toggle_ai_reply(id: string, enable: boolean): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat;
    }>;
    search_messages(user_id: string, query: string): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat[];
    }>;
    get_unanswered_ai_messages(user_id: string): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat[];
    }>;
    bulk_insert_messages(body: any[]): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat[];
    }>;
    update_status(id: string, body: {
        status: "sent" | "delivered" | "read" | "failed";
        error_message?: string;
    }): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat;
    }>;
    update_ai_reply(id: string, body: {
        ai_reply: string;
        model?: string;
    }): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat;
    }>;
    generate_ai_reply(id: string): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat | undefined;
    }>;
    chat_history(user_id: string, client_id: string): Promise<{
        message: string;
        result: import("./ai_reply_hub_chat.entity").AiReplyHubChat[];
    }>;
    user_message_partner(user_id: string): Promise<{
        message: string;
        result: any;
    }>;
    chat_mark_as_read_service(message_id: string): Promise<{
        message: string;
        result: any;
    }>;
}
