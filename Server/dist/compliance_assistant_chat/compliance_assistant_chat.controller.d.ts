import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
export declare class ComplianceAssistantController {
    private readonly AssistantChatService;
    constructor(AssistantChatService: ComplianceAssistantChatService);
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
