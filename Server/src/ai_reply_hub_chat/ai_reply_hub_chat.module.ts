import { Module } from "@nestjs/common";
import { AiReplyHubChatService } from "./ai_reply_hub_chat.service";
import { AiReplyHubChatController } from "./ai_reply_hub_chat.controller";
import { AiReplyHubChat } from "./ai_reply_hub_chat.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatgptService } from "src/chatgpt/chatgpt.service";
import { AuthService } from "src/auth/auth.service";
import { UserBusinessInfoService } from "src/user_business_info/user_business_info.service";
import { UserBusinessInfo } from "src/user_business_info/user_business_info.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AiReplyHubChat, UserBusinessInfo])],
  providers: [AiReplyHubChatService, ChatgptService, UserBusinessInfoService],
  controllers: [AiReplyHubChatController],
  exports: [AiReplyHubChatService],
})
export class AiReplyHubChatModule {}
