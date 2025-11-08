import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
@Injectable()
export class ChatgptService {
  private openai: OpenAI;
  private OPENAI_API_KEY: any = process.env.OPENAI_API_KEY;
  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>(this.OPENAI_API_KEY),
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "o1-mini", // or 'gpt-4o', 'gpt-4-turbo'
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });
      return response.choices[0]?.message?.content || "No response.";
    } catch (error: any) {
      console.log(error);
      if (error.status === 429) {
        return "API rate limit exceeded. Please try again later.";
      }
      console.error(error);
      return "An error occurred while generating the response.";
    }
  }
}
