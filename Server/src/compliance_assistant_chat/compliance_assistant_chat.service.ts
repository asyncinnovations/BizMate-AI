import { Injectable, HttpException } from "@nestjs/common";
import OpenAI from "openai";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ComplianceAssistantChat } from "./compliance_assistant_chat.entity";

@Injectable()
export class ComplianceAssistantChatService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(ComplianceAssistantChat)
    private readonly compliance_assistant: Repository<ComplianceAssistantChat>
  ) {
    this.openai = new OpenAI({
      apiKey: `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`,
    });
  }
  //////////////////////////////////////
  // ASK QUESTION  TO AI
  //////////////////////////////////////
  public async askAI(data: any) {
    try {
      const systemPrompt = `
        You are a UAE Compliance Assistant.
        Provide step-by-step guidance for VAT, ESR, Trade License Renewal, and UAE government procedures.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: data.question },
        ],
      });

      const answer: any = response.choices[0].message.content;

      // Save chat to DB
      const chat = this.compliance_assistant.create({
        answer: answer,
        question: data.question,
        user_id: data.user_id,
      });
      const result = await this.compliance_assistant.save(chat);

      return result;
    } catch (err) {
      console.error(err);
      throw new HttpException("AI processing failed", 500);
    }
  }

  //////////////////////////////////////////////////
  // GET CHAT HISTORY
  //////////////////////////////////////////////////
  public async user_chat_history_service(userId: string) {
    const result = await this.compliance_assistant.find({
      where: { user_id: userId },
    });
    return result;
  }

  ///////////////////////////////////////////////////
  // DELETE CHAT HISTORY
  ///////////////////////////////////////////////////
  public async delete_chat_service(chatId: string, userId: string) {
    const chat = await this.compliance_assistant.findOne({
      where: { uuid: chatId, user_id: userId },
    });
    if (!chat) {
      throw new HttpException("Chat not found", 404);
    }
    const result = await this.compliance_assistant.remove(chat);
    return result;
  }

  /////////////////////////////////////////////////////
  // CLEAR ALL CHAT HISTORY
  /////////////////////////////////////////////////////
  public async clear_chat_history_service(userId: string) {
    await this.compliance_assistant.delete({ user_id: userId });
    return { message: "All chat history cleared." };
  }

  //////////////////////////////////////////////////////
  // SEARCH CHAT HISTORY
  //////////////////////////////////////////////////////
  public async searchChat(userId: string, keyword: string) {
    return await this.compliance_assistant
      .createQueryBuilder("chat")
      .where("chat.userId = :userId", { userId })
      .andWhere("chat.question ILIKE :keyword OR chat.answer ILIKE :keyword", {
        keyword: `%${keyword}%`,
      })
      .orderBy("chat.timestamp", "ASC")
      .getMany();
  }
}
