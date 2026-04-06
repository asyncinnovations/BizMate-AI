import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
import { GPTService } from "src/services/GPTService";
import { AiReminderService } from "src/ai_reminder/ai_reminder.service";
export declare class ComplianceAssistantController {
    private readonly AssistantChatService;
    private readonly gpt_service;
    private readonly reminderService;
    constructor(AssistantChatService: ComplianceAssistantChatService, gpt_service: GPTService, reminderService: AiReminderService);
    chat_gpt(body: any): Promise<{
        message: string;
        response: string | null;
    }>;
    askAI(body: any): Promise<{
        message: string;
        reminder: Promise<import("../ai_reminder/ai_reminder.entity").AiReminder>;
        response: any;
        answer?: undefined;
    } | {
        message: string;
        answer: any;
        reminder?: undefined;
        response?: undefined;
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
