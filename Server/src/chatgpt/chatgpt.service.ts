import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class ChatgptService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    this.openai = new OpenAI({ apiKey });
  }

  ///////////////////////////////////////////////////////////////////////////
  // BASIC RESPONSE BASED ON PROMPT
  ///////////////////////////////////////////////////////////////////////////
  async generate_response_service(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "o1-mini", // or 'gpt-4o', 'gpt-4-turbo'
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      return response.choices[0]?.message?.content || "No response.";
    } catch (error: any) {
      console.error(error);
      if (error.status === 429) {
        return "API rate limit exceeded. Please try again later.";
      }
      return "An error occurred while generating the response.";
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // AI REPLY BASED ON BUSINESS INFO
  ///////////////////////////////////////////////////////////////////////////
  async generate_ai_reply_service(
    message: string,
    options?: {
      model?: string;
      businessSnapshot?: any; // full business info JSON from DB
      temperature?: number;
      purpose?: "reply" | "faq" | "tone_examples";
    }
  ): Promise<string> {
    try {
      const model = options?.model || "gpt-4o-mini";
      const temperature = options?.temperature ?? 0.7;

      const systemContent = options?.businessSnapshot
        ? `You are a professional AI assistant trained on this business information: ${JSON.stringify(
            options.businessSnapshot
          )}. Respond appropriately to the client.`
        : "You are a helpful AI assistant for a business communication platform.";

      const messages: any = [
        { role: "system", content: systemContent },
        { role: "user", content: message },
      ];

      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        temperature,
      });

      const aiReply = completion.choices[0]?.message?.content?.trim();
      if (!aiReply) throw new Error("No reply generated from OpenAI");

      return aiReply;
    } catch (error) {
      console.error("AI reply generation failed:", error);
      return "⚠️ Sorry, I couldn’t generate a response right now.";
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // GENERATE FAQ FROM BUSINESS INFO
  ///////////////////////////////////////////////////////////////////////////
  async generate_faq_service(businessSnapshot: any): Promise<any[]> {
    const prompt = `Create 5-10 FAQ questions and answers based on this business info: ${JSON.stringify(
      businessSnapshot
    )}. Return as a JSON array of objects [{question, answer}]`;

    const faqText = await this.generate_ai_reply_service(prompt, {
      businessSnapshot,
      purpose: "faq",
    });

    try {
      return JSON.parse(faqText);
    } catch {
      return []; // fallback if AI didn't return proper JSON
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // GENERATE TON EXAMPLE
  ///////////////////////////////////////////////////////////////////////////
  async generate_exampletone_service(businessSnapshot: any): Promise<any[]> {
    const prompt = `Generate 3-5 tone examples for replying to clients for this business. Include situation and how AI should respond: ${JSON.stringify(
      businessSnapshot
    )}. Return as JSON array [{situation, ai_should_reply_like}]`;

    const toneText = await this.generate_ai_reply_service(prompt, {
      businessSnapshot,
      purpose: "tone_examples",
    });

    try {
      return JSON.parse(toneText);
    } catch {
      return [];
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // CREATE EMBEDING THE BUSINESS DATA
  ///////////////////////////////////////////////////////////////////////////
  async create_embedding_service(text: string): Promise<number[]> {
    try {
      const res = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return res.data[0].embedding;
    } catch (error) {
      console.error("Error creating embedding:", error);
      return [];
    }
  }
}
