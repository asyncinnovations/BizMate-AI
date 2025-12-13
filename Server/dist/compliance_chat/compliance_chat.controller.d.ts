import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
export declare class ComplianceAssistantController {
    private readonly AssistantChatService;
    constructor(AssistantChatService: ComplianceAssistantChatService);
    askAI(body: any): Promise<{
        message: string;
        response: any;
    }>;
    user_chat_history(user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    deleteChat(chat_id: string, user_id: string): Promise<{
        message: string;
        response: any;
    }>;
    clear_chat_history(user_id: string): Promise<any>;
    searchChat(userId: string, keyword: string): Promise<{
        message: string;
        response: any;
    }>;
}
