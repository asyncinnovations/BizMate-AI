import OpenAI from "openai";
export declare class OpenAIService {
    private client;
    constructor();
    summarize_document(text: string): Promise<string | null>;
    generateText(prompt: string): Promise<string>;
    chat(messages: Array<{
        role: "user" | "assistant";
        content: string;
    }>): Promise<string | null>;
    createEmbedding(text: string): Promise<number[]>;
    processDocumentText(text: string): Promise<string | null>;
    customCompletion(config: OpenAI.Chat.Completions.ChatCompletionCreateParams): Promise<(OpenAI.Chat.Completions.ChatCompletion & {
        _request_id?: string | null;
    }) | (import("openai/core/streaming.js").Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & {
        _request_id?: string | null;
    })>;
}
