import { ConfigService } from "@nestjs/config";
export declare class ChatgptService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    generate_response_service(prompt: string): Promise<string>;
    generate_ai_reply_service(message: string, options?: {
        model?: string;
        businessSnapshot?: any;
        temperature?: number;
        purpose?: "reply" | "faq" | "tone_examples";
    }): Promise<string>;
    generate_faq_service(businessSnapshot: any): Promise<any[]>;
    generate_exampletone_service(businessSnapshot: any): Promise<any[]>;
    create_embedding_service(text: string): Promise<number[]>;
}
