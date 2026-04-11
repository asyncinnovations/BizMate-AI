import { Repository } from "typeorm";
import { ComplianceAssistantChat } from "./compliance_assistant_chat.entity";
import { GPTService } from "src/services/GPTService";
import { PromptService } from "src/services/PromptService";
export declare class ComplianceAssistantChatService {
    private readonly compliance_assistant;
    private readonly gpt_service;
    private readonly prompt_service;
    constructor(compliance_assistant: Repository<ComplianceAssistantChat>, gpt_service: GPTService, prompt_service: PromptService);
    askAI(data: any): Promise<ComplianceAssistantChat>;
    user_chat_history_service(userId: string): Promise<any>;
    delete_chat_service(chatId: string, userId: string): Promise<ComplianceAssistantChat>;
    clear_chat_history_service(userId: string): Promise<{
        message: string;
    }>;
    searchChat(userId: string, keyword: string): Promise<ComplianceAssistantChat[]>;
}
