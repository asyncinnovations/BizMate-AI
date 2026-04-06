import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  Param,
  Req,
  HttpException,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
import { GPTService } from "src/services/GPTService";
import { AiReminderService } from "src/ai_reminder/ai_reminder.service";

@Controller("compliance_assistant_chat")
export class ComplianceAssistantController {
  constructor(
    private readonly AssistantChatService: ComplianceAssistantChatService,
    private readonly gpt_service: GPTService,
    private readonly reminderService: AiReminderService,
  ) {}
  ///////////////////////////////////////////////
  // ASK QUESTION AI
  ///////////////////////////////////////////////
  @Post("compliance_ai")
  async chat_gpt(@Body() body: any) {
    try {
      const response = await this.gpt_service.GPTChat(
        body.prompt,
        "you are a compliance assistant you must answer to the related compliance.",
      );
      return { message: "success", response: response.data.content };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  ///////////////////////////////////////////////
  // ASK QUESTION AI
  ///////////////////////////////////////////////
  @Post("ask-ai")
  @HttpCode(HttpStatus.CREATED)
  async askAI(@Body() body: any) {
    try {
      const response: any = await this.AssistantChatService.askAI(body);
      const parsed: any = JSON.parse(response.answer);
      // SET REMINDER IF EXIST
      if (parsed.type === "reminder") {
        const reminder_result = this.reminderService.create_reminder_service({
          user_id: body.user_id,
          title: parsed.title,
          description: parsed.description,
          type: parsed.reminder_type || "Custom",
          reminder_date: new Date(parsed.reminder_date),
          notify_before: parsed.notify_before || 3,
          notify_channels: parsed.notify_channels,
          recurrence_rule: parsed.recurrence_rule || "none",
          status: "pending",
        });
        return {
          message: "Reminder created successfully",
          reminder: reminder_result,
          response: response.answer,
        };
      }

      // NORMAL RESPONSE
      return {
        message: "AI response",
        answer: response.answer,
      };
    } catch (error: any) {
      throw new HttpException(
        error?.message || "AI request failed",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  ////////////////////////////////////////
  // GET CHAT HISTORY
  ////////////////////////////////////////
  @Get("user/history/:user_id")
  @HttpCode(HttpStatus.OK)
  async user_chat_history(@Param("user_id") user_id: string) {
    try {
      const response =
        await this.AssistantChatService.user_chat_history_service(user_id);
      return { message: "user history retrived", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  //////////////////////////////////////////////
  // DELETE CHAT HISTORY
  //////////////////////////////////////////////
  @Delete("delete/:chat_id/:user_id")
  @HttpCode(HttpStatus.OK)
  async deleteChat(
    @Param("chat_id") chat_id: string,
    @Param("user_id") user_id: string,
  ) {
    try {
      const response = await this.AssistantChatService.delete_chat_service(
        chat_id,
        user_id,
      );
      return { message: "chat deleted", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ////////////////////////////////////////////
  // DELETE ALL CHATS
  ////////////////////////////////////////////
  @Delete("clear/:user_id")
  @HttpCode(HttpStatus.OK)
  async clear_chat_history(@Param("user_id") user_id: string) {
    try {
      const result =
        await this.AssistantChatService.clear_chat_history_service(user_id);
      return result;
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  ////////////////////////////////////////////////
  // SEARCH CHAT HISTORY
  ////////////////////////////////////////////////
  @Get("search/:user_id")
  @HttpCode(HttpStatus.OK)
  async searchChat(
    @Param("user_id") userId: string,
    @Query("keyword") keyword: string,
  ) {
    try {
      const response = await this.AssistantChatService.searchChat(
        userId,
        keyword,
      );
      return { message: "search result", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
