import { Repository } from "typeorm";
import { ComplianceAssistantChat } from "./compliance_assistant_chat.entity";
export declare class ComplianceAssistantChatService {
    private readonly compliance_assistant;
    private openai;
    constructor(compliance_assistant: Repository<ComplianceAssistantChat>);
    askAI(data: any): Promise<ComplianceAssistantChat>;
    user_chat_history_service(userId: string): Promise<ComplianceAssistantChat[]>;
    delete_chat_service(chatId: string, userId: string): Promise<ComplianceAssistantChat>;
    clear_chat_history_service(userId: string): Promise<{
        message: string;
    }>;
    searchChat(userId: string, keyword: string): Promise<ComplianceAssistantChat[]>;
}
