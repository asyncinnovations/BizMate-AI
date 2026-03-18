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

@Controller("compliance_assistant_chat")
export class ComplianceAssistantController {
  constructor(
    private readonly AssistantChatService: ComplianceAssistantChatService,
    private readonly gpt_service: GPTService,
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
      const data = {
        user_id: body.user_id,
        question: body.question,
        answer:
          "To submit VAT for Q3 2024, follow these steps: 1) Login to FTA portal, 2) Upload VAT return spreadsheet, 3) Submit before 28/10/2024, 4) Keep the receipt for records.",
      };
      const response = await this.AssistantChatService.askAI(data);
      return { message: "ai response", response };
    } catch (error: any) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
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
