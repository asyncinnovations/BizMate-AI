import OpenAI from "openai";
export declare class GPTService {
    GPTChat(user_prompt: string, system_prompt: string): Promise<{
        message: string;
        data: OpenAI.Chat.Completions.ChatCompletionMessage;
    }>;
}
