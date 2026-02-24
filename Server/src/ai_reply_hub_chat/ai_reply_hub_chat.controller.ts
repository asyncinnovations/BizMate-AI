import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Put,
} from "@nestjs/common";
import { AiReplyHubChatService } from "./ai_reply_hub_chat.service";
import { JwtGuard } from "src/guards/auth/auth.guard";

@Controller("reply_hub_chat")
// @UseGuards(JwtGuard)
export class AiReplyHubChatController {
  constructor(private readonly aireplyHub: AiReplyHubChatService) {}

  //////////////////////////////////////////////
  // CREATE NEW MESSAGE
  //////////////////////////////////////////////
  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async create_message(@Body() body: any) {
    if (!body.user_id || !body.client_id || !body.message) {
      throw new BadRequestException(
        "user_id, client_id and message are required",
      );
    }
    const result = await this.aireplyHub.create_message_service(body);
    return { message: "Message created successfully", result };
  }

  //////////////////////////////////////////////
  // GET SINGLE MESSAGE BY ID OR UUID
  //////////////////////////////////////////////
  @Get("single/:id")
  @HttpCode(HttpStatus.OK)
  async get_single_message(@Param("id") id: string) {
    const result = await this.aireplyHub.single_message_service(id);
    return { message: "Message fetched successfully", result };
  }

  //////////////////////////////////////////////
  // GET ALL MESSAGES (Optional filters)
  //////////////////////////////////////////////
  @Get("all/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_all_messages(
    @Param("user_id") user_id: string,
    @Query("client_id") client_id?: string,
    @Query("platform") platform?: string,
    @Query("direction") direction?: string,
  ) {
    const result = await this.aireplyHub.all_messages_service(user_id, {
      client_id,
      platform,
      direction,
    });
    return { message: "Messages fetched successfully", result };
  }

  //////////////////////////////////////////////
  // UPDATE MESSAGE
  //////////////////////////////////////////////
  @Patch("update/:id")
  @HttpCode(HttpStatus.OK)
  async update_message(@Param("id") id: string, @Body() body: any) {
    const result = await this.aireplyHub.update_message_service(id, body);
    return { message: "Message updated successfully", result };
  }

  //////////////////////////////////////////////
  // DELETE MESSAGE
  //////////////////////////////////////////////
  @Delete("delete/:id")
  @HttpCode(HttpStatus.OK)
  async delete_message(@Param("id") id: string) {
    const result = await this.aireplyHub.delete_message_service(id);
    return { message: "Message deleted successfully", result };
  }

  //////////////////////////////////////////////
  // ENABLE / DISABLE AI AUTO-REPLY
  //////////////////////////////////////////////
  @Patch("toggle-ai-reply/:id")
  @HttpCode(HttpStatus.OK)
  async toggle_ai_reply(
    @Param("id") id: string,
    @Query("enable") enable: boolean,
  ) {
    const result = await this.aireplyHub.toggle_ai_reply(id, enable);
    return { message: "AI auto-reply toggled", result };
  }

  //////////////////////////////////////////////
  // SEARCH MESSAGES
  //////////////////////////////////////////////
  @Get("search/:user_id")
  @HttpCode(HttpStatus.OK)
  async search_messages(
    @Param("user_id") user_id: string,
    @Query("q") query: string,
  ) {
    if (!query || query.trim().length < 1) {
      throw new BadRequestException("Search query must not be empty");
    }
    const result = await this.aireplyHub.search_messages_service(
      user_id,
      query,
    );
    return { message: "Search results", result };
  }

  //////////////////////////////////////////////
  // FETCH UNANSWERED AI MESSAGES
  //////////////////////////////////////////////
  @Get("unanswered/:user_id")
  @HttpCode(HttpStatus.OK)
  async get_unanswered_ai_messages(@Param("user_id") user_id: string) {
    const result =
      await this.aireplyHub.unanswered_ai_messages_service(user_id);
    return { message: "Unanswered AI messages fetched", result };
  }

  //////////////////////////////////////////////
  // BULK INSERT MESSAGES
  //////////////////////////////////////////////
  @Post("bulk-insert")
  @HttpCode(HttpStatus.OK)
  async bulk_insert_messages(@Body() body: any[]) {
    if (!Array.isArray(body) || body.length === 0) {
      throw new BadRequestException("Body must be a non-empty array");
    }
    const result = await this.aireplyHub.bulk_insert_service(body);
    return { message: "Bulk insert successful", result };
  }

  //////////////////////////////////////////////
  // UPDATE MESSAGE STATUS
  //////////////////////////////////////////////
  @Patch("update-status/:id")
  @HttpCode(HttpStatus.OK)
  async update_status(
    @Param("id") id: string,
    @Body()
    body: {
      status: "sent" | "delivered" | "read" | "failed";
      error_message?: string;
    },
  ) {
    const { status, error_message } = body;
    const result = await this.aireplyHub.update_status_service(
      id,
      status,
      error_message,
    );
    return { message: "Status updated successfully", result };
  }

  //////////////////////////////////////////////
  // MANUALLY UPDATE AI REPLY
  //////////////////////////////////////////////
  @Patch("update-ai-reply/:id")
  @HttpCode(HttpStatus.OK)
  async update_ai_reply(
    @Param("id") id: string,
    @Body() body: { ai_reply: string; model?: string },
  ) {
    const { ai_reply, model } = body;
    const result = await this.aireplyHub.update_ai_reply_service(
      id,
      ai_reply,
      model,
    );
    return { message: "AI reply updated successfully", result };
  }

  //////////////////////////////////////////////
  // GENERATE AI REPLY
  //////////////////////////////////////////////
  @Post("generate-ai-reply/:id")
  @HttpCode(HttpStatus.OK)
  async generate_ai_reply(@Param("id") id: string) {
    const message = await this.aireplyHub.single_message_service(id);
    const result = await this.aireplyHub.generate_ai_reply_service(message);
    return { message: "AI reply generated successfully", result };
  }

  //////////////////////////////////////////////
  // FETCH CHAT HISTORY BY CLIENT
  //////////////////////////////////////////////
  @Get("history/:user_id/:client_id")
  @HttpCode(HttpStatus.OK)
  async chat_history(
    @Param("user_id") user_id: string,
    @Param("client_id") client_id: string,
  ) {
    const result = await this.aireplyHub.message_by_client_service(
      user_id,
      client_id,
    );
    return { message: "Chat history fetched", result };
  }

  //////////////////////////////////////////////
  // FETCH CHAT HISTORY BY CLIENT
  //////////////////////////////////////////////
  @Get("chat_partner/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_message_partner(@Param("user_id") user_id: string) {
    const result = await this.aireplyHub.user_chat_partner_service(user_id);
    return { message: "Chat history fetched", result };
  }

  //////////////////////////////////////////////
  // FETCH CHAT HISTORY BY CLIENT
  //////////////////////////////////////////////
  @Patch("mark_as_read/:message_id")
  @HttpCode(HttpStatus.OK)
  async chat_mark_as_read_service(@Param("message_id") message_id: string) {
    const result = await this.aireplyHub.user_chat_partner_service(message_id);
    return { message: "Message marked as read", result };
  }
}
