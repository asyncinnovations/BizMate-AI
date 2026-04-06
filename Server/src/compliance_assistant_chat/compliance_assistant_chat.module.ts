import { Module } from "@nestjs/common";
import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
import { ComplianceAssistantController } from "./compliance_assistant_chat.controller";
import { ComplianceAssistantChat } from "./compliance_assistant_chat.entity";
import { AiReminderService } from "src/ai_reminder/ai_reminder.service";
import { AiReminder } from "src/ai_reminder/ai_reminder.entity";
import { PromptService } from "src/services/PromptService";
import { GPTService } from "src/services/GPTService";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceAssistantChat, AiReminder])],
  providers: [
    ComplianceAssistantChatService,
    GPTService,
    AiReminderService,
    PromptService,
  ],
  controllers: [ComplianceAssistantController],
})
export class ComplianceAssistantModule {}
