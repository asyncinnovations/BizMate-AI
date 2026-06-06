// src/ai_reminder/ai_reminder.module.ts
// UPDATED — added GPTService and PromptService for AI generation

import { Module }              from "@nestjs/common";
import { TypeOrmModule }       from "@nestjs/typeorm";
import { AiReminderService }   from "./ai_reminder.service";
import { AiReminderController } from "./ai_reminder.controller";
import { AiReminder }          from "./ai_reminder.entity";
import { GPTService }          from "src/services/GPTService";
import { PromptService }       from "src/services/PromptService";
import { ChatgptService }      from "src/chatgpt/chatgpt.service";

@Module({
  imports: [TypeOrmModule.forFeature([AiReminder])],
  providers: [
    AiReminderService,
    GPTService,
    PromptService,
    ChatgptService,
  ],
  controllers: [AiReminderController],
  exports:     [AiReminderService],
})
export class AiReminderModule {}
