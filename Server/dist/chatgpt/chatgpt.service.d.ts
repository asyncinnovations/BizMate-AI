import { ConfigService } from "@nestjs/config";
export declare class ChatgptService {
    private configService;
    private openai;
    private OPENAI_API_KEY;
    constructor(configService: ConfigService);
    generateResponse(prompt: string): Promise<string>;
}
