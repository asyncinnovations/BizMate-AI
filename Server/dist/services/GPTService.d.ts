export declare class GPTService {
    GPTChat(user_prompt: string, system_prompt: string): Promise<{
        message: string;
        data: any;
    }>;
}
