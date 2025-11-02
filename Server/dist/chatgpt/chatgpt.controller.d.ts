import { ChatgptService } from "./chatgpt.service";
export declare class ChatgptController {
    private readonly gptService;
    constructor(gptService: ChatgptService);
    chat(prompt: string): Promise<{
        reply: string;
    }>;
    send_document_form(): {
        message: string;
    };
}
