import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { AiReplyHubChat } from "./ai_reply_hub_chat.entity";
import { ChatgptService } from "src/chatgpt/chatgpt.service";
import { AuthService } from "./../auth/auth.service";
import { UserBusinessInfoService } from "src/user_business_info/user_business_info.service";

@Injectable()
export class AiReplyHubChatService {
  constructor(
    @InjectRepository(AiReplyHubChat)
    private readonly aireplyhubRepo: Repository<AiReplyHubChat>,
    private readonly BusinessInfo: UserBusinessInfoService,
    private readonly openAIService: ChatgptService,
    // private readonly UserRepo: AuthService
  ) {}

  private async getBusinessContext(userId: string): Promise<string> {
    return "This business sells organic products and offers 24/7 customer service.";
  }

  ///////////////////////////////////////////////////////////////
  // CREATE NEW REPLY / MESSAGE
  ///////////////////////////////////////////////////////////////
  async create_message_service(data: Partial<AiReplyHubChat>) {
    const message = this.aireplyhubRepo.create(data);
    const result = await this.aireplyhubRepo.save(message);
    return result;
  }

  /////////////////////////////////////////////////////////
  // GET SINGLE MESSAGE BY ID OR UUID
  /////////////////////////////////////////////////////////
  async single_message_service(idOrUuid: string | number) {
    const message = await this.aireplyhubRepo.findOne({
      where: [
        { id: typeof idOrUuid === "number" ? idOrUuid : undefined },
        { uuid: typeof idOrUuid === "string" ? idOrUuid : undefined },
      ],
    });

    if (!message) throw new NotFoundException("Message not found");
    return message;
  }

  /////////////////////////////////////////////////////////
  // GET ALL MESSAGES FOR USER (OPTIONAL FILTERS: client, platform, direction)
  /////////////////////////////////////////////////////////
  async all_messages_service(
    user_id: string,
    options?: { client_id?: string; platform?: string; direction?: string },
  ) {
    const query = this.aireplyhubRepo
      .createQueryBuilder("msg")
      .where("msg.user_id = :user_id", { user_id });

    if (options?.client_id)
      query.andWhere("msg.client_id = :client_id", {
        client_id: options.client_id,
      });
    if (options?.platform)
      query.andWhere("msg.platform = :platform", {
        platform: options.platform,
      });
    if (options?.direction)
      query.andWhere("msg.direction = :direction", {
        direction: options.direction,
      });

    const result = await query.orderBy("msg.sent_at", "DESC").getMany();
    return result;
  }

  /////////////////////////////////////////////////////////
  // UPDATE MESSAGE
  /////////////////////////////////////////////////////////
  async update_message_service(
    idOrUuid: string | number,
    data: Partial<AiReplyHubChat>,
  ) {
    const message = await this.single_message_service(idOrUuid);
    Object.assign(message, data);
    const result = await this.aireplyhubRepo.save(message);
    return result;
  }

  /////////////////////////////////////////////////////////
  // DELETE MESSAGE
  /////////////////////////////////////////////////////////
  async delete_message_service(idOrUuid: string) {
    const result = await this.aireplyhubRepo.delete({ uuid: idOrUuid });
    return result;
  }

  /////////////////////////////////////////////////////////
  // ENABLE / DISABLE AI AUTO-REPLY FOR A MESSAGE
  /////////////////////////////////////////////////////////
  async toggle_ai_reply(idOrUuid: string | number, enable: boolean) {
    const result = await this.update_message_service(idOrUuid, {
      ai_reply_enable: enable,
    });
    return result;
  }

  /////////////////////////////////////////////////////////
  // SEARCH MESSAGES BY CONTENT (LIKE search)
  /////////////////////////////////////////////////////////
  async search_messages_service(user_id: string, query: string) {
    const result = await this.aireplyhubRepo.find({
      where: [
        { user_id, message: Like(`%${query}%`) },
        { user_id, ai_reply: Like(`%${query}%`) },
      ],
      order: { sent_at: "DESC" },
    });
    return result;
  }

  /////////////////////////////////////////////////////////
  // GET UNANSWERED INBOUND MESSAGES (AI pending)
  /////////////////////////////////////////////////////////
  async unanswered_ai_messages_service(user_id: string) {
    const response = await this.aireplyhubRepo.find({
      where: {
        user_id,
        direction: "inbound",
        ai_reply_enable: true,
        ai_reply: "",
        status: "sent",
      },
      order: { sent_at: "ASC" },
    });
    return response;
  }

  /////////////////////////////////////////////////////////
  // BULK INSERT MESSAGES
  /////////////////////////////////////////////////////////
  async bulk_insert_service(messages: Partial<AiReplyHubChat>[]) {
    const entities = this.aireplyhubRepo.create(messages);
    const result = await this.aireplyhubRepo.save(entities);
    return result;
  }

  /////////////////////////////////////////////////////////
  // MARK MESSAGE AS DELIVERED / READ / FAILED
  /////////////////////////////////////////////////////////
  async update_status_service(
    idOrUuid: string | number,
    status: "sent" | "delivered" | "read" | "failed",
    error_message?: string,
  ) {
    const result = await this.update_message_service(idOrUuid, {
      status,
      error_message,
    });
    return result;
  }

  //////////////////////////////////////////////
  // UPDATE AI REPLY MANUALLY
  //////////////////////////////////////////////
  async update_ai_reply_service(
    uuid: string,
    ai_reply: string,
    model?: string,
  ) {
    const msg = await this.aireplyhubRepo.findOneBy({ uuid });
    if (!msg) throw new Error("Message not found");
    msg.ai_reply = ai_reply;
    if (model) msg.ai_model = model;
    const result = this.aireplyhubRepo.save(msg);
    return result;
  }

  //////////////////////////////////////////////
  // GENERATE AI REPLY
  //////////////////////////////////////////////
  async generate_ai_reply_service(message: AiReplyHubChat) {
    try {
      // FETH USER BUSINESS INFO
      const businessInfo = await this.BusinessInfo.user_business_info_service(
        message.user_id,
      );
      const prompt = `You are replying to a client. Use this business info as context: ${JSON.stringify(
        businessInfo,
      )}\nClient message: ${message.message}`;
      const response = await this.openAIService.generate_ai_reply_service(
        prompt,
        {
          model: "",
          businessSnapshot: "",
          purpose: "reply",
        },
      );

      // Update the message with AI reply
      message.ai_reply = response;
      message.ai_model = "GPT-4"; // or GPT-3.5/local
      const result = await this.aireplyhubRepo.save(message);
      return result;

      // we can send outbound via platform (email/WhatsApp)
    } catch (err: any) {
      console.error("AI reply failed:", err);
      message.error_message = err.message;
      await this.aireplyhubRepo.save(message);
    }
  }

  //////////////////////////////////////////////
  // FETCH CHAT HISTORY BY CLIENT
  //////////////////////////////////////////////
  async message_by_client_service(user_id: string, client_id: string) {
    const response = this.aireplyhubRepo.find({
      where: { user_id, client_id },
      order: { sent_at: "ASC" },
    });
    return response;
  }

  //////////////////////////////////////////////
  // FETCH CHAT HISTORY BY CLIENT
  //////////////////////////////////////////////
  async chat_mark_as_read_service(message_id: string) {
    await this.aireplyhubRepo.update({ uuid: message_id }, { status: "read" });
    return this.aireplyhubRepo.findOne({ where: { uuid: message_id } });
  }

  ////////////////////////////////////////////////
  // FETCH ALL CHAT PARTNERS OF A USER
  ////////////////////////////////////////////////
  async user_chat_partner_service(userId: string) {
    const partners = await this.aireplyhubRepo.query(
      `
      SELECT 
        c.uuid AS client_uuid,
        c.name AS client_name,
        c.whatsapp_number,
        c.email,
        last_chat.message,
        last_chat.direction,
        last_chat.status,
        last_chat.platform,
        last_chat.sent_at
      FROM client_lists c
      LEFT JOIN (
        SELECT DISTINCT ON (client_id)
          client_id,
          message,
          direction,
          status,
          platform,
          sent_at
        FROM ai_reply_hub_chats
        WHERE user_id = $1
        ORDER BY client_id, sent_at DESC
      ) last_chat 
      ON last_chat.client_id = c.uuid OR last_chat.client_id = c.uuid
      ORDER BY last_chat.sent_at DESC
    `,
      [userId],
    );
    return partners;
  }
}
