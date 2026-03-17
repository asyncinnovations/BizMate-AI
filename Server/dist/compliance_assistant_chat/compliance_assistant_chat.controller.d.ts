import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
import { GPTService } from "src/services/GPTService";
export declare class ComplianceAssistantController {
    private readonly AssistantChatService;
    private readonly gpt_service;
    constructor(AssistantChatService: ComplianceAssistantChatService, gpt_service: GPTService);
    chat_gpt(body: any): Promise<{
        message: string;
        response: string | null;
    }>;
    askAI(body: any): Promise<{
        message: string;
        response: import("./compliance_assistant_chat.entity").ComplianceAssistantChat;
    }>;
    user_chat_history(user_id: string): Promise<{
        message: string;
        response: import("./compliance_assistant_chat.entity").ComplianceAssistantChat[];
    }>;
    deleteChat(chat_id: string, user_id: string): Promise<{
        message: string;
        response: import("./compliance_assistant_chat.entity").ComplianceAssistantChat;
    }>;
    clear_chat_history(user_id: string): Promise<{
        message: string;
    }>;
    searchChat(userId: string, keyword: string): Promise<{
        message: string;
        response: import("./compliance_assistant_chat.entity").ComplianceAssistantChat[];
    }>;
}
