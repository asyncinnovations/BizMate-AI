import OpenAI from "openai";
export declare class OpenAIService {
    private client;
    constructor();
    summarize_document(text: string): Promise<any>;
    generateText(prompt: string): Promise<string>;
    chat(messages: Array<{
        role: "user" | "assistant";
        content: string;
    }>): Promise<any>;
    createEmbedding(text: string): Promise<any>;
    processDocumentText(text: string): Promise<any>;
    customCompletion(config: OpenAI.Chat.Completions.ChatCompletionCreateParams): Promise<any>;
}
