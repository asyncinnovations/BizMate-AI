import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarize_document(text: string) {
    const aiResponse = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize this UAE compliance document." },
        { role: "user", content: text },
      ],
    });
    const summary = aiResponse.choices[0].message.content;
    return summary;
  }
  /**
   * Simple text completion
   */
  async generateText(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    return response.choices[0].message.content || "";
  }

  /**
   * Chat conversation
   */
  async chat(messages: Array<{ role: "user" | "assistant"; content: string }>) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1",
      messages,
    });

    return response.choices[0].message.content;
  }

  /**
   * Generate embeddings (for search/semantic matching)
   */
  async createEmbedding(text: string) {
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  }

  /**
   * Pass extracted file text to OpenAI for summary/analysis
   */
  async processDocumentText(text: string) {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "user", content: `Analyze this document:\n\n${text}` },
      ],
    });

    return response.choices[0].message.content;
  }

  /**
   * Universal method — send any custom config
   */
  async customCompletion(
    config: OpenAI.Chat.Completions.ChatCompletionCreateParams
  ) {
    return await this.client.chat.completions.create(config);
  }
}
