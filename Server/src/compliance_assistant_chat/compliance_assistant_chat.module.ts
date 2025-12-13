import { Module } from "@nestjs/common";
import { ComplianceAssistantChatService } from "./compliance_assistant_chat.service";
import { ComplianceAssistantController } from "./compliance_assistant_chat.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ComplianceAssistantChat } from "./compliance_assistant_chat.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceAssistantChat])],
  providers: [ComplianceAssistantChatService],
  controllers: [ComplianceAssistantController],
})
export class ComplianceAssistantModule {}
