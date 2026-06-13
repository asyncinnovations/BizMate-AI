import { Repository } from "typeorm";
import { AiReplyHubChat } from "./ai_reply_hub_chat.entity";
import { ChatgptService } from "src/chatgpt/chatgpt.service";
import { UserBusinessInfoService } from "src/user_business_info/user_business_info.service";
export declare class AiReplyHubChatService {
    private readonly aireplyhubRepo;
    private readonly BusinessInfo;
    private readonly openAIService;
    constructor(aireplyhubRepo: Repository<AiReplyHubChat>, BusinessInfo: UserBusinessInfoService, openAIService: ChatgptService);
    private getBusinessContext;
    create_message_service(data: Partial<AiReplyHubChat>): Promise<any>;
    single_message_service(idOrUuid: string | number): Promise<any>;
    all_messages_service(user_id: string, options?: {
        client_id?: string;
        platform?: string;
        direction?: string;
    }): Promise<any>;
    update_message_service(idOrUuid: string | number, data: Partial<AiReplyHubChat>): Promise<any>;
    delete_message_service(idOrUuid: string): Promise<any>;
    toggle_ai_reply(idOrUuid: string | number, enable: boolean): Promise<any>;
    search_messages_service(user_id: string, query: string): Promise<any>;
    unanswered_ai_messages_service(user_id: string): Promise<any>;
    bulk_insert_service(messages: Partial<AiReplyHubChat>[]): Promise<any>;
    update_status_service(idOrUuid: string | number, status: "sent" | "delivered" | "read" | "failed", error_message?: string): Promise<any>;
    update_ai_reply_service(uuid: string, ai_reply: string, model?: string): Promise<any>;
    generate_ai_reply_service(message: AiReplyHubChat): Promise<any>;
    message_by_client_service(user_id: string, client_id: string): Promise<any>;
    chat_mark_as_read_service(message_id: string): Promise<any>;
    chat_mark_as_all_read_service(client_id: string): Promise<any>;
    user_chat_partner_service(userId: string): Promise<any>;
}
